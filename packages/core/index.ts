import EventEmitter from 'node:events'
import {isValidEvent} from '@my-monorepo/lib'
import isEmpty from '@naverpay/hidash/isEmpty'

type Handler = (...args: any[]) => void
type Listener = {handler: Handler; once: boolean}

class Core extends EventEmitter {
    // 이벤트 타입과 핸들러를 저장
    #listeners: Record<string, Listener[]> = {}

    constructor() {
        super()
    }

    /**
     * 이벤트 등록
     * @param eventType - 이벤트 타입
     * @param handler - 이벤트 핸들러 함수
     * @param once - 한 번만 실행되는지 여부 (기본값: false)
     */
    registerEvent(eventType: string, handler: Handler, once = false): void {
        if (!isValidEvent(handler)) {
            throw new Error('Invalid handler')
        }

        // 이벤트 타입 초기화
        if (!this.#listeners[eventType]) {
            this.#listeners[eventType] = []
        }

        // 핸들러 등록
        const wrappedHandler = once ? this.#wrapOnceHandler(eventType, handler) : handler
        this.#addListener(eventType, wrappedHandler, once)
    }

    /**
     * 이벤트 트리거
     * @param eventType - 트리거할 이벤트 타입
     * @param args - 핸들러에 전달할 인수
     */
    emitEvent(eventType: string, ...args: unknown[]): void {
        if (!this.#listeners[eventType] || this.#listeners[eventType].length === 0) {
            console.warn(`No listeners registered for event: ${eventType}`)
            return
        }
        this.emit(eventType, ...args)
    }

    /**
     * 특정 이벤트의 핸들러 제거
     * @param eventType - 제거할 이벤트 타입
     * @param handler - 제거할 핸들러 함수
     */
    removeEvent(eventType: string, handler: Handler): void {
        if (!this.#listeners[eventType]) return

        // 내부 관리용 배열에서 삭제
        this.#listeners[eventType] = this.#listeners[eventType].filter((listener) => listener.handler !== handler)

        // 실제 EventEmitter에서도 제거
        this.removeListener(eventType, handler)

        // 해당 타입의 리스너가 모두 제거되면 배열 삭제
        if (this.#listeners[eventType].length === 0) {
            delete this.#listeners[eventType]
        }
    }

    /**
     * 특정 이벤트의 모든 핸들러 제거
     * @param eventType - 제거할 이벤트 타입
     */
    removeAllEvents(eventType: string): void {
        if (!this.#listeners[eventType]) return

        // 실제 EventEmitter에서 모든 리스너 제거
        this.removeAllListeners(eventType)

        // 내부 관리용 객체에서 삭제
        delete this.#listeners[eventType]
    }

    /**
     * 현재 등록된 모든 리스너 반환 (디버깅 용도)
     */
    getListeners(): Record<string, Listener[]> {
        return JSON.parse(JSON.stringify(this.#listeners))
    }

    /** ===========================
     * Private Methods (Internal)
     ============================ */

    /**
     * 핸들러를 한번만 실행되도록 래핑하는 메서드
     */
    #wrapOnceHandler(eventType: string, handler: Handler): Handler {
        return (...args: unknown[]) => {
            handler(...args)
            this.removeEvent(eventType, handler)
        }
    }

    /**
     * 리스너를 추가하는 내부 메서드
     */
    #addListener(eventType: string, handler: Handler, once: boolean): void {
        this[once ? 'once' : 'on'](eventType, handler) // EventEmitter API 사용

        // 내부 관리용 배열에 추가
        this.#listeners[eventType]?.push({handler, once})
    }
}

const coreInstance = new Core()
export default coreInstance
