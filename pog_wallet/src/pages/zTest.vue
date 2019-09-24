<template>
    <div>
        <button @click="handle">点我测试</button>
        <div v-for='err in errs'>{{err}}</div>
    </div>
</template>

<script>
import ClientSocket from '@/socket/ClientSocket'
export default {
    data(){
        return {
            errs: []
        }
    },
    mounted() {
      this.errs.push('mounted')
      alert(1)
      document.addEventListener('deviceready', onDeviceready('deviceready'), false);
      
    },
    methods: {
        handle () {
            this.err = typeof nodejs
        },
        onDeviceready (msg) {
            this.errs.push(msg)
            this.startNode()
        },
        startNode () {
            const that = this
            if (nodejs) {
                nodejs.start('main.js', function() {
                    that.errs.push('startupCallback')
                })
            }
        }
    },
}
</script>