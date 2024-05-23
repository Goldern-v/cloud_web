<script lang="ts">

export default defineComponent({
  created() {
    const { params, query } = useRoute()
    const { path } = params
    const router = useRouter()
    router.replace({ path: '/' + path, query }).catch(err => {
      console.log(err)
    })
  },
  render() {
    return h('div')
  }
})
</script>
