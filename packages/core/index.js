import EventEmitter from 'node:events';
import {isValidEvent}from '@my-monorepo/lib'
import isEmpty from '@naverpay/hidash/isEmpty'

class Core extends EventEmitter {
    // 이벤트 타입과 핸들러를 저장
    #listeners = {}; 

    constructor() {
        super();
    }

    /**
     * 이벤트 등록
     * @param {string} eventType - 이벤트 타입
     * @param {Function} handler - 이벤트 핸들러 함수
     * @param {boolean} [once=false] - 한 번만 실행되는지 여부
     */
    registerEvent(eventType, handler, once = false) {
        if (!isValidEvent(handler)) {
            throw new Error('Invalid handler')
        }
        if (isEmpty(this.#listeners[eventType])) {
            this.#listeners[eventType] = [];
        }

        // 핸들러 등록
        if (once) {
            const wrappedHandler = (...args) => {
                handler(...args);
                this.removeEvent(eventType, wrappedHandler);
            };
            this.once(eventType, wrappedHandler);
            this.#listeners[eventType].push({ handler: wrappedHandler, once });
        } else {
            this.on(eventType, handler);
            this.#listeners[eventType].push({ handler, once });
        }   
    }

    /**
     * 이벤트 트리거
     * @param {string} eventType - 트리거할 이벤트 타입
     * @param  {...any} args - 핸들러에 전달할 인수
     */
    emitEvent(eventType, ...args) {
        if (!this.#listeners[eventType]) {
            console.warn(`No listeners registered for event: ${eventType}`);
            return;
        }
        this.emit(eventType, ...args);
    }

    /**
     * 특정 이벤트의 핸들러 제거
     * @param {string} eventType - 제거할 이벤트 타입
     * @param {Function} handler - 제거할 핸들러 함수
     */
    removeEvent(eventType, handler) {
        if (!this.#listeners[eventType]) return;

        // 내부 관리용 배열에서 삭제
        this.#listeners[eventType] = this.#listeners[eventType].filter(
            (listener) => listener.handler !== handler
        );

        // 실제 EventEmitter에서도 제거
        this.removeListener(eventType, handler);

        // 해당 타입의 리스너가 모두 제거되면 배열 삭제
        if (this.#listeners[eventType].length === 0) {
            delete this.#listeners[eventType];
        }
    }

    /**
     * 특정 이벤트의 모든 핸들러 제거
     * @param {string} eventType - 제거할 이벤트 타입
     */
    removeAllEvents(eventType) {
        if (!this.#listeners[eventType]) return;

        // 실제 EventEmitter에서 모든 리스너 제거
        this.removeAllListeners(eventType);

        // 내부 관리용 객체에서 삭제
        delete this.#listeners[eventType];
    }

    /**
     * 현재 등록된 모든 리스너 반환 (디버깅 용도)
     */
    getListeners() {
        return JSON.parse(JSON.stringify(this.#listeners));
    }
}

const coreInstance = new Core();
export default coreInstance;
