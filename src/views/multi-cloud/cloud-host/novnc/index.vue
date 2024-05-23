<template>
  <div ref="canvas" class="novnc-container">
    <div class="novnc-container-top">
      <div class="novnc-container-status">Loading</div>
      <div id="sendCtrlAltDelButton" @click="sendCtrlAltDel">Send CtrlAltDel</div>
    </div>
    <div id="screen"></div>
  </div>
</template>

<script setup lang="ts">
import RFB from '@novnc/novnc/core/rfb'
import { ElNotification, ElMessage } from 'element-plus'

const novnc = reactive({
  rfb: null as any
})

onMounted(() => {
  connectVnc()
})

const sendCtrlAltDel = () => {
  if (novnc.rfb) {
    novnc.rfb.sendCtrlAltDel()
  }
  return false
}

// 调试用
const reset = () => {
  setTimeout(() => {
    ElMessage.warning('关闭连接中')
    novnc.rfb && novnc.rfb._disconnect()
  }, 1000)
  setTimeout(() => {
    ElMessage.warning('重新连接中')
    connectVnc()
  }, 3000)
}
// vnc连接断开的回调函数
const disconnectedFromServer = (msg?: any) => {
  console.log(msg)
  if (msg.detail.clean) {
    // 根据 断开信息的msg.detail.clean 来判断是否可以重新连接
    // this.connectVnc() // 自动重连屏蔽，防止多用户操作一个互相无限重连、防止页面销毁自动重连
    status('Disconnected')
    ElNotification({
      type: 'info',
      message: 'vnc连接中断',
      position: 'bottom-right'
    })
  } else {
    status('Something went wrong, connection is closed')
    //这里做不可重新连接的一些操作
    ElNotification({
      type: 'error',
      message: 'vnc异常',
      position: 'bottom-right'
    })
  }
}
// 连接成功的回调函数
const connectedToServer = (msg?: string) => {
  console.log('success', msg)
  ElNotification({
    type: 'success',
    message: 'vnc连接成功',
    position: 'bottom-right'
  })
}
const status = (text: string) => {
  const statusDom = document.getElementById('status')
  if (statusDom) {
    statusDom.textContent = text
  }
}
const route = useRoute()
//连接vnc的函数
const connectVnc = () => {
  ElNotification({
    type: 'info',
    message: 'vnc连接中',
    position: 'bottom-right'
  })
  const requestUrl = route.query.remoteLoginUrl
  const rfb = new RFB(document.getElementById('screen'), requestUrl, {
    // wsProtocols: [SUB_PROTOCOL]
    // 向vnc 传递的一些参数，比如说虚拟机的开机密码等 zz
    // credentials: {password: PASSWORD }
  })
  rfb.addEventListener('connect', connectedToServer)
  rfb.addEventListener('disconnect', disconnectedFromServer)
  rfb.scaleViewport = true // scaleViewport指示是否应在本地扩展远程会话以使其适合其容器。禁用时，如果远程会话小于其容器，则它将居中，或者根据clipViewport它是否更大来处理。默认情况下禁用。
  rfb.resizeSession = true // 是一个boolean指示是否每当容器改变尺寸应被发送到调整远程会话的请求。默认情况下禁用
  console.log(rfb)
  novnc.rfb = rfb
}
</script>

<style scoped lang="scss">
.novnc-container {
  width: 100%;
  height: calc(100% - 88px);
  margin: 0;
  background-color: dimgrey;
  display: flex;
  flex-direction: column;
  position: relative;
  .novnc-container-top {
    background-color: #6e84a3;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 6px 5px 4px 5px;
    border-bottom: 1px outset;
    .novnc-container-status {
      text-align: center;
    }
    #sendCtrlAltDelButton {
      position: absolute;
      top: 0px;
      right: 0px;
      border: 1px outset;
      padding: 5px 5px 4px 5px;
      cursor: pointer;
    }
  }
  #screen {
    flex: 1; /* fill remaining space */
    overflow: hidden;
  }
}
</style>
