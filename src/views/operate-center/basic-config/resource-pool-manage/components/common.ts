export const useCommon = () => {
  const route = useRoute()
  const cloudCategory = route.query.cloudCategory as string
  const cloudType = route.query.cloudType as string

  const isPublicAli =
    RegExp(/ALI/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  const isPublicTencent =
    RegExp(/TENCENT/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  const isPublicHuawei =
    RegExp(/HUAWEI/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  const isPublicCtyun =
    RegExp(/CTYUN/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  const isPublicAmazon =
    RegExp(/AWS/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  const isPublicZenlayer =
    RegExp(/ZENLAYER/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  const isPrivateHuawei =
    RegExp(/HUAWEI/).test(cloudType) && RegExp(/PRIVATE/).test(cloudCategory)
  const isPrivateVmware =
    RegExp(/VMWARE/).test(cloudType) && RegExp(/PRIVATE/).test(cloudCategory)
  const isPrivateZstack =
    RegExp(/ZSTACK/).test(cloudType) && RegExp(/PRIVATE/).test(cloudCategory)
  const isPrivateCtyun =
    RegExp(/CTYUN/).test(cloudType) && RegExp(/PRIVATE/).test(cloudCategory)
  return {
    isPublicAli,
    isPublicTencent,
    isPublicHuawei,
    isPublicCtyun,
    isPublicAmazon,
    isPublicZenlayer,
    isPrivateHuawei,
    isPrivateVmware,
    isPrivateZstack,
    isPrivateCtyun
  }
}
