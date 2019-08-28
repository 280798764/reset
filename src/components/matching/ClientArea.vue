<!-- 客户区域 -->
<template>
  <div class="matching-wrapper">
    <label :style="{width: labelWid}">客户区域</label>
    <div class="select-wrapper">
      <Select v-model="ModelId" :label-in-value="true" @on-change="optionChanges" filterable clearable>
        <Option v-for="item in list" :value="item.id" :key="item.id" style="width:200px">{{item.name}}</Option>
      </Select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ModelId: this.id,
      ModelName: '',
      list: []
    }
  },
  props: {
    id: {
      type: [Number, String],
      default: ''
    },
    labelWid: {
      type: String,
      default: '100px'
    },
    delayReq: { //  是否延时加载
      type: Boolean,
      default: false
    }
  },
  created () {
    if (this.delayReq) {
      setTimeout(() => {
        this.getList()
      }, 200)
    } else {
      this.getList()
    }
  },
  methods: {
    // 获取客户区域列表
    getList () {
      this.$store.dispatch('a:common/getClientAreas', {level: 3}).then(
        res => {
          this.list = res || []
        }
      )
    },
    // 选项变化
    optionChanges (option) {
      if (option) {
        this.ModelId = option.value
        this.ModelName = option.label
      }
    },
    // 获取选中的id和name
    getSelectedOption () {
      return {
        id: this.ModelId,
        name: this.ModelName
      }
    }
  }
}
</script>
