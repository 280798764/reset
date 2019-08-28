<!-- 广告管理-删除广告位 -->
<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span v-if="dlgInfo.type === 'import'">批量导入</span>
        <span v-if="dlgInfo.type === 'edit'">修改</span>
        <span v-if="dlgInfo.type === 'delete'">删除提示</span>
        <span class="dlg-close"><i class="iconfont close" @click="cancel"></i></span>
      </div>
      <div class="dialog-body" v-if="dlgInfo.type === 'edit'">
        <div class="wrap">
          <p><span>魔盒编号：</span>{{editParams.boxNo}}</p>
          <p><span>使用权：</span>{{editParams.userName}}</p>
          <p><span>接入号码：</span><input type="text" v-model="editParams.number"></p>
          <p><span>ICCID：</span><input type="text" v-model="editParams.iccid"></p>
        </div>
      </div>
      <div class="dialog-body" v-if="dlgInfo.type === 'delete'">
        <p class="message">确认删除当前条目？</p>
      </div>
      <div class="dialog-body" v-if="dlgInfo.type === 'import'">
        <div class="wrap">
          <p class="updownText" @click="baseUpload">下载导入模板</p>
          <p class="up">
            <input type="text" style="width: 220px" v-model="upFile" readonly>
            <button class="btn" @click="UploadFile">选择文件</button>
            <input class="fileUp" type="file" style="display:none" id="uploadFileList" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
          </p>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="btn btn-cancel wid-140px mr-15px" @click="cancel">取消</div>
        <div class="btn btn-sure wid-140px" @click="edit" v-if="dlgInfo.type === 'edit'">修改</div>
        <div class="btn btn-sure wid-140px" @click="uploadFileToCloud" v-if="dlgInfo.type === 'import'">上传</div>
        <div class="btn btn-sure wid-140px" @click="deleteFun" v-if="dlgInfo.type === 'delete'">删除</div>
      </div>
    </div>
  </section>
</template>

<script>
import mixinsInfo from '@/utils/mixinsInfo'
import { DOMAIN } from '@/utils/config'

export default {
  data () {
    return {
      upFile: '',
      file: '',
      cmd: ''
    }
  },
  mixins: [mixinsInfo],
  props: ['downUp', 'nameCn', 'dlgInfo', 'params', 'insertSecond', 'editParams', 'Cmd'],
  methods: {
    // 取消
    cancel () {
      this.$emit('cancel')
    },
    // 修改
    edit () {
      this.$emit('cancel')
      // 删除
      this.$parent.editFun()
    },
    // 下载导入模板
    baseUpload () {
      window.location.href = `${DOMAIN.originExport}/getTemplate?userToken=${window.sessionStorage.getItem('userToken')}&&userId=`
    },
    // 文件上传事件
    UploadFile () {
      let cmd = DOMAIN.originExport + '/importSim'
      document.getElementById('uploadFileList').value = ''
      document.getElementById('uploadFileList').click()
      document.getElementById('uploadFileList').onchange = e => {
        let file = e.target.files && e.target.files[0]
        let fileType = file.name && file.name.substring(file.name.lastIndexOf('.'))
        if (file === '' || file === null) {
          this.alert('请选择所要上传的文件！', 'info')
        } else if (fileType !== '.xls' && fileType !== '.xlsx') {
          this.alert('上传文件格式不正确!', 'info')
        } else {
          this.upFile = file.name
          this.file = file
          this.cmd = cmd
          // this.uploadFileToCloud(file, cmd)
        }
      }
    },
    // 文件上传到云
    uploadFileToCloud () {
      if (!this.upFile) {
        this.alert('请选择导入的文件！', 'error')
        return
      }
      let file = this.file
      let cmd = this.cmd
      this.$store.dispatch('a:file/fileUpload', {file, cmd}).then(
        res => {
          this.alert(res + '！', 'success')
          this.$parent.getTableList(this.Cmd, this.params)
          this.$emit('cancel')
        },
        rej => {
          this.$Modal.error({
            title: '错误',
            content: rej
          })
        }
      )
    },
    // 确认
    deleteFun () {
      this.$emit('cancel')
      // 删除
      this.$parent.trueDelete()
    }
  }
}
</script>

<style lang="less" scoped>
.message {
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.info {
  margin-top: 20px;
}
.dialog-wrapper .dialog {
  width: 500px;
}
  .dialog-body .wrap {
    padding: 10px 60px;
    p {
      position: relative;
      height: 35px;
      line-height: 35px;
      span {
        margin-right: 10px;
        display: inline-block;
        width: 70px;
        text-align: right;
      }
      input {
        width: 180px;
        height: 25px;
        border-radius: 3px;
        border: 1px solid #C9C9C9;
        outline: none;
        padding: 0 5px;
      }
      .btn, .fileUp {
        width: 92px;
        height: 25px;
        line-height: 25px;
      }
      .btn {
        background-color: #FABF40;
        outline: none;
        border: none;
        border-radius: 3px;
        margin-left: 10px;
        color: #fff;
      }
      .fileUp {
        position: absolute;
        right: 15px;
        top: 25px;
        opacity: 0;
      }
    }
    .updownText {
      text-align: right;
      color: #169BD5;
      cursor: pointer;
    }
    .up {
      min-height: 80px;
      padding-top: 20px;
    }
  }
</style>
