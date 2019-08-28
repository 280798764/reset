<!-- iBox工厂编辑、新增组件 -->
<template>
  <section class="update-wrap">
    <div class="split-line"></div>
    <div class="filter">
      <div class="filter-title">
        会员名称
      </div>
      <div class="imdata-input filter-input border-none">{{thisUserFacList.memberName}}</div>
      <div class="filter-title">
        手机号码
      </div>
      <div class="imdata-input filter-input border-none">{{thisUserFacList.mobile}}</div>
    </div>
    <div class="split-line"></div>
    <div class="filter-line" v-for="(itemP,index) in thisUserFacList.factoryAuthParamList" :key="index">
      <template v-if="itemP.factoryName">
        <div class="item-line">
         <span class="FacName">选择工厂名称</span>
          <input type="text" v-model="itemP.factoryName" readonly class="imdata-input filter-input FacInput">
         <span class="delete-btn" @click="deleFacInfo(itemP.factoryId, itemP.orgGroupId, index)">删除</span>
        </div>
      </template>
      <template v-else>
       <div class="item-line">
         <span class="FacName">选择工厂名称</span>
         <Row>
           <Col style="width:300px" >
           <Select v-model="factoryId[index]" filterable clearable>
             <Option v-for="item in propertyId" :value="item.id" :key="item.id">{{ item.name }}</Option>
           </Select>
           </Col>
         </Row>
         <span class="delete-btn" @click="deleFacInfo(itemP.factoryId, itemP.orgGroupId, index)">删除</span>
       </div>
      </template>
    </div>
    <div class="func-btns-wrapper">
      <div class="func-btn btn-create left-btn" @click="addOtherFac">
        继续添加工厂
      </div>
    </div>
    <!-- 工厂信息区域 -->
    <div class="split-line"></div>
   <div class="filter">
     <div class="filter-title">申请来源</div>
     <div class="select-wrapper">
       <Select v-model="thisUserFacList.applySourceId" clearable>
         <Option v-for="item in applySourceList" :value="item.id" :key="item.id">{{item.applySource}}</Option>
       </Select>
     </div>
   </div>
    <div class="filter">
      <div class="filter-title">
        业务人员
      </div>
      <input type="text" class="imdata-input filter-input" v-model="thisUserFacList.businessPerson"/>
    </div>
    <div class="filter">
      <div class="filter-title">
        发送邮箱
      </div>
      <input type="text" class="imdata-input filter-input" v-model="thisUserFacList.sendEmail"/><span class="require">---&nbsp;暂不支持isesol邮箱&nbsp;---</span>
    </div>
    <div class="filter">
      <div class="filter-title">
        备注
      </div>
      <textarea class="filter-textarea" v-model="thisUserFacList.remark"></textarea>
    </div>
    <div class="filter">
      <div class="filter-title">
        账户操作
      </div>
      <RadioGroup v-model="thisUserFacList.operation" style="height: 30px;line-height: 25px;margin-left: 15px">
        <Radio label='1'>立即开通</Radio>
        <Radio label= '2'>稍后开通</Radio>
        <Radio label= '3'>冻结</Radio>
      </RadioGroup>
    </div>
    <!-- 底部功能按钮 -->
    <section class="btns-group">
      <div class="btn btn-gray" @click="backForward">返回</div>
      <div class="btn btn-blue" @click="updateUserFacInfo">确定</div>
    </section>
  </section>
</template>

<script>
import tool from '@/utils/tool'
import { MatchingId } from '@/components/matching'
export default {
  data () {
    return {
      factoryLen: '', //  判断原有工厂的个数
      model11: '',
      model12: [],
      oldApplySourceId: '',
      factoryIdNum: '', // 工厂类型
      clientInpu: '',
      clientInputWid: '350px',
      applySourceList: [],
      propertyId: [], // 工厂名称
      params: {
        propertyId: '' // 工厂名称
      },
      resInfo: {},
      length: 0,
      facInfoParams: {
        factoryId: '',
        factoryName: '',
        orgGroupId: '',
        pageIds: [],
        roleIds: []
      },
      factoryId: [],
      factoryList: [],
      thisUserFacList: {
        applySourceId: null, // 来源id
        businessPerson: '', // 业务人员名称
        factoryAuthParamList: [], // 页面列表
        gender: '', // 性别
        memberCode: '', // 会员编号
        memberName: '', // 会员名称
        mobile: '', // 手机号
        operation: '1', // 操作类型
        sendEmail: '' // 业务人员邮箱
      }, // 表单数据源
      resetParams: {
        memberCode: ''
      },
      animal: '立即开通', // radio值
      isEmail: ''//  匹配邮箱
    }
  },
  components: {
    MatchingId
  },
  created () {
    this.isEmail = tool.isEmail
  },
  mounted () {
    this.oldApplySourceId = ''
    // 获取模块下的页面信息
    this.$store.dispatch('a:device/getAllPageButton').then(
      res => {
        for (let item of res) {
          if (item.moduleName === 'ibox_wx_app') {
            this.facInfoParams.pageIds.push(item.pages[0].pageId)
          }
        }
      }
    )
    this.getPropertyId()
    this.resetParams.memberCode = sessionStorage.getItem('memberCode')
    this.readDetail()
    this.getApplySourceList()
  },
  methods: {
    // 继续添加工厂
    addOtherFac () {
      this.length = this.thisUserFacList.factoryAuthParamList.length
      this.thisUserFacList.factoryAuthParamList.push(this.facInfoParams)
      this.factoryId.splice(this.length, 0, [])
      this.length++
    },
    // 获取申请来源列表
    getApplySourceList () {
      this.$store.dispatch('a:device/getResourceList', {}).then(
        res => {
          this.applySourceList = res
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 解除工厂绑定
    deleFacInfo (facId, orgGroupId, index) {
      if (tool.nullParam(orgGroupId)) {
        this.thisUserFacList.factoryAuthParamList.splice(index, 1)
        this.factoryId.splice(index, 1)
        this.length--
      } else {
        let params = {
          facId: facId,
          memberCode: this.thisUserFacList.memberCode,
          groupId: orgGroupId
        }
        this.$store.dispatch('a:device/deleteRoleGroup', params).then(
          res => {
            location.reload(false)
          }
        )
      }
    },
    // 新增或编辑用户与工厂的绑定
    updateUserFacInfo () {
      if (!this.isEmail(this.thisUserFacList.sendEmail)) {
        this.alert('邮箱格式不正确！', 'error')
        return
      }
      let arr = this.factoryId
      if (arr.length <= 0) {
        this.alert('请选择需要绑定权限的工厂！', 'error')
        return
      }
      // 原理:在由数组变成的字符串中的首次出现位置和最后一次出现位置是否一致,如果不一致,就说明这个重复出现了.
      for (let index in arr) {
        if (arr.indexOf(arr[index]) !== arr.lastIndexOf(arr[index])) {
          this.alert('工厂名称不能重复！', 'error')
          return
        } else if (arr[index].length <= 0) {
          this.alert('工厂名称不能为空！', 'error')
          return
        }
      }
      let _newFacAhthParamList = []
      // 用户绑定的工厂列表
      let userFacInfo = this.thisUserFacList.factoryAuthParamList
      let facList = this.factoryList
      for (let index in userFacInfo) {
        let newItem = {}
        // 封装用户绑定工厂信息 index下的工厂id
        newItem.factoryId = this.factoryId[index]
        for (let pageItem in facList) {
          if (newItem.factoryId === facList[pageItem].id) {
            // 取得工厂名称
            newItem.factoryName = facList[pageItem].name
          }
        }
        newItem.orgGroupId = userFacInfo[index].orgGroupId
        newItem.roleIds = userFacInfo[index].roleIds
        newItem.pageIds = userFacInfo[index].pageIds
        // newItem.pageIds = this.pageIds[index]
        // 封装后的用户绑定的每条工厂及页面id信息
        _newFacAhthParamList.push(newItem)
      }
      let _newParams = this.thisUserFacList
      // 替换原来的用户绑定的工厂信息
      _newParams.factoryAuthParamList = _newFacAhthParamList
      // 更新接口
      this.$store.dispatch('a:device/userBindFactory', _newParams).then(
        () => {
          this.$Modal.info({
            title: '提示',
            content: '更新成功!',
            onOk: () => {
              this.$router.push('/operations/FactoryList')
            }
          })
        }
      )
    },
    // 获取工厂名称
    getPropertyId () {
      this.$store.dispatch('a:device/selectFactory', {}).then(
        res => {
          this.propertyId = res || []
          this.factoryList = res || []
          // console.log(this.propertyId, 'propertyId')
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 读取
    readDetail () {
      this.$store.dispatch('a:device/getUserBindFactoryInfo', this.resetParams).then(
        res => {
          this.thisUserFacList = res || {}
          this.thisUserFacList.operation = String(res.operation)
          this.oldApplySourceId = res.applySourceId
          // 初始化factoryId数组长度
          let value = this.thisUserFacList.factoryAuthParamList
          for (let index in value) {
            this.factoryId.splice(index, 0, value[index].factoryId)
          }
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      ).then(
        res => {
          this.thisUserFacList.applySourceId = this.oldApplySourceId
        }
      )
    },
    // 返回
    backForward () {
      let goToUpdate = sessionStorage.getItem('goToUpdate')
      if (goToUpdate === '1') {
        this.$router.push('/operations/FactoryList')
      } else {
        this.$router.push('/operations/GetUser')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../../assets/styles/pages/device/general.less';
  .control {
    padding: 11px 30px;
    width: 300px;
    height: 50px;
    margin: 0 auto;
    font-size: 12px;
    color: #586F75;
    div {
      margin-left: 25px;
    }
  }
  .border-none {border: none;}
  .add-fac-btn {
    width: 100px;
    margin-left: 50px;
    text-align: center;
  }
  .matching-wrapper:nth-of-type(1) {
    margin-left: 87px;
    margin-top: 15px;
  }
  .filter-line {
    position: relative;
  }
  .delete {
    display: inline-block;
    position: absolute;
    right: 570px;
    top: 4px;
    color: red;
    cursor: pointer;
  }
  .deleteBtn {
    display: inline-block;
    width: 50px;
  }
  .delete-btn {
    color: red;
    cursor: pointer;
  }
  .delete:nth-of-type(1) {
    left: 92px;
    color: #586F75;
  }
  .add-fac-btn {
    background-color: #FABF40 !important;
  }
  .left-btn {
    float: left !important;
  }
  .func-btns-wrapper {
    margin-top: 0;
    border: none !important;
  }
  .FacInput {
    margin: 0 20px 0 30px;
    width: 300px;
  }
  .FacName {
    margin-left: 93px;
    color: #586F75;
  }
  .item-line {
    margin-top: 10px;
    width: 100%;
  }
  .ivu-row {
    display: inline-block;
    margin: 0 20px 0 30px;
  }
  .update-wrap {
    background-color: #fff;
  }
</style>
