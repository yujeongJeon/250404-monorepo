import coreInstance from '@my-monorepo/core'

type Data = Record<string, unknown>

// 이벤트 핸들러 정의
function onModuleRegistered(data: Data) {
    console.log(`[Component] Module registered with data:`, data)
}

function onModuleUpdated(data: Data) {
    console.log(`[Component] Module updated with new data:`, data)
}

function onOnceExample(data: Data) {
    console.log(`[Component] This will only run once!`, data)
}

// 이벤트 등록
coreInstance.registerEvent('moduleRegistered', onModuleRegistered)
coreInstance.registerEvent('moduleUpdated', onModuleUpdated)
coreInstance.registerEvent('onceExample', onOnceExample, true)

// 이벤트 트리거
coreInstance.emitEvent('moduleRegistered', {name: 'TestModule', version: '1.0.0'})
coreInstance.emitEvent('moduleUpdated', {name: 'TestModule', version: '1.1.0'})
coreInstance.emitEvent('onceExample', {message: 'This should only appear once!'})
coreInstance.emitEvent('onceExample', {message: 'This should not appear again!'})

// 특정 이벤트 핸들러 제거
coreInstance.removeEvent('moduleUpdated', onModuleUpdated)

// 다시 트리거하면 moduleUpdated는 실행되지 않음
coreInstance.emitEvent('moduleUpdated', {name: 'TestModule', version: '1.2.0'})

// 모든 moduleRegistered 리스너 제거
coreInstance.removeAllEvents('moduleRegistered')

// 디버깅 용도로 현재 리스너 확인
console.log('[Component] Current listeners:', coreInstance.getListeners())
