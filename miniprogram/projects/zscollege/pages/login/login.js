// projects/zscollege/pages/login/login.js
const pageHelper = require('../../../../helper/page_helper.js');
const helper = require('../../../../helper/helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
const validate = require('../../../../helper/validate.js');
const ProjectBiz = require('../../biz/project_biz.js');
const projectSetting = require('../../public/project_setting.js');
const setting = require('../../../../setting/setting.js');
const PassportBiz = require('../../../../comm/biz/passport_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

  },
  
  bindSubmitTap: async function (e) {
    try {
			let data = this.data;
			// 数据校验 
			data = validate.check(data, PassportBiz.CHECK_FORM_LOGIN, this);
			if (!data) return;
      console.log(data)
			let opts = {
				title: '提交中'
			}
			await cloudHelper.callCloudSumbit('passport/login_with_password', data, opts).then(result => {
				if (result && helper.isDefined(result.data.token) && result.data.token) {
					if (!projectSetting.USER_REG_CHECK) PassportBiz.setToken(result.data.token);

					let callback = () => {
						if (this.data.retUrl == 'back')
							wx.navigateBack();
						else if (this.data.retUrl)
							wx.redirectTo({
								url: this.data.retUrl,
							})
            else
						wx.reLaunch({ url: '../my/index/my_index' });
					}

					if (projectSetting.USER_REG_CHECK)
						pageHelper.showModal('注册完成，等待系统审核', '温馨提示', callback);
					else
					pageHelper.showSuccToast('登录成功', 1500, callback);
        }
        else
          pageHelper.showErrToast('用户名密码错误',1500,null)
			});
		} catch (err) {
			console.error(err);
		}
  }
})