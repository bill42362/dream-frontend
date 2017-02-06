// App.react.js
'use strict'
import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import URLSafe from 'urlsafe-base64';
import Postcodes from '../../../common/core/TaiwanPostcodes.js';
import Header from '../../../common/react/Header.react.js';
import ConnectedAnimateSquare from './ConnectedAnimateSquare.react.js';
import PictureEditor from '../core/PictureEditor.js';
import ImageInputBox from './ImageInputBox.react.js';
import BootstrapInput from '../../../common/react/BootstrapInput.react.js';
import BootstrapRadios from '../../../common/react/BootstrapRadios.react.js';
import BootstrapDateInput from '../../../common/react/BootstrapDateInput.react.js';
import BootstrapSelect from '../../../common/react/BootstrapSelect.react.js';
import Footer from '../../../common/react/Footer.react.js';

const cities = Object.keys(Postcodes);
const ConnectedFooter = connect(state => { return {links: state.siteMap}; })(Footer);
const ConnectedImageInputBox = connect(
    state => { return {editorState: state.pictureEditor}; },
    dispatch => { return {
        movePicture: vector => { return dispatch(PictureEditor.Actions.movePicture(vector)); },
        stretchPicture: vector => { return dispatch(PictureEditor.Actions.stretchPicture(vector)); },
    }; },
)(ImageInputBox);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.staticStrings = { };
        this.state = {
            userSapId: '',
            userProfile: {
                pictureSrc: '', nickname: '', name: '',
                gender: '', birthday: '', phoneNumber: '', email: '',
                postcode: '', city: '', address: '',
            },
        };
        this.submit = this.submit.bind(this);
        this.onGetUserSapIdSuccess = this.onGetUserSapIdSuccess.bind(this);
        this.onReadUserProfilesSuccess = this.onReadUserProfilesSuccess.bind(this);
        this.onChange = this.onChange.bind(this);
        if(window.PBPlusDream) {
            this.state.userSapId = PBPlusDream.userSapId;
            if(!PBPlusDream.userSapId) {
                PBPlusDream.getUserSapId(undefined, this.onGetUserSapIdSuccess);
            } else {
                PBPlusDream.readProfiles([PBPlusDream.userSapId], undefined, this.onReadUserProfilesSuccess);
            }
        }
    }
    cancel() { history.back(); }
    submit() {
        const state = this.state;
        if(window.PBPlusDream && state.userSapId) {
            PBPlusDream.saveProfiles(
                state.userProfile,
                this.onAjaxError,
                response => { Toastr.success('儲存成功'); }
            );
        }
    }
    onGetUserSapIdSuccess(sapId) {
        if(sapId) { PBPlusDream.readProfiles([sapId], undefined, this.onReadUserProfilesSuccess); }
        else {
            Toastr.warning('您必須登入後才能修改會員資訊，5 秒後為您轉至登入頁。');
            window.setTimeout(() => {
                let locationBase64 = URLSafe.encode(btoa(location.pathname + location.search));
                location.href = '/login?location=' + locationBase64;
            }, 5000);
        }
        this.setState({userSapId: sapId});
    }
    onReadUserProfilesSuccess(profiles) {
        const stateUserProfile = this.state.userProfile;
        const userProfile = profiles.filter(profile => +this.state.userSapId === +profile.userPK)[0];
        if(userProfile) {
            const newUserProfile = {};
            Object.keys(stateUserProfile).forEach(key => {
                newUserProfile[key] = stateUserProfile[key] || userProfile[key] || '';
            });
            if(newUserProfile.pictureSrc) {
                this.props.updateUserImageSource(newUserProfile.pictureSrc);
            }
            this.setState({userProfile: newUserProfile});
        }
    }
    onAjaxError(xhr) {
        let networkError = '網路錯誤，請檢查您的網路，或稍候再試一次。<br />'
            + 'Network error, please check your network, or try again later.';
        let systemError = '系統錯誤，請稍候再試一次。<br />System error, please try again later.';
        if(!xhr.message) {
            Toastr['error'](networkError);
        } else if(/5\d\d/.test(xhr.status)) {
            Toastr['error'](xhr.status + ' "' + xhr.message + '"<br />' + systemError);
        } else {
            Toastr['warning'](xhr.status + ', ' + xhr.message);
        }
    }
    onChange() {
        let userProfile = {
            nickname: this.refs.nickname.getValue(),
            name: this.refs.name.getValue(),
            gender: this.refs.gender.getValue(),
            birthday: this.refs.birthday.getValue(),
            phoneNumber: this.refs.phoneNumber.getValue(),
            email: this.refs.email.getValue(),
            postcode: this.refs.postcode.getValue(),
            city: this.refs.city.getValue(),
            address: this.refs.address.getValue(),
        };
        this.setState({ userProfile });
    }
    componentDidMount() { }
    componentWillUnmount() { }
    render() {
        const { userProfile } = this.state;
        let userPicture = '/img/mock_user_icon.jpg';
        if(userProfile) { userPicture = userProfile.pictureSrc || userPicture; }
        return <div id='wrapper'>
            <Header fixed={false} />
            <h1 className='user-info-title'>使用者資訊</h1>
            <div className='user-info-panel'>
                <div className='user-image-section' style={{position: 'relative'}}>
                    <ConnectedImageInputBox style={{zIndex: '1'}} />
                    <ConnectedAnimateSquare canvasProps={{style: {
                        position: 'absolute',
                        width: '100%', height: '100%',
                        top: '0px', left: '0px',
                    }}} />
                </div>
                <div className='user-info-form'>
                    <div className='user-info-form-inputs'>
                        <div className='row'>
                            <BootstrapInput
                                ref='nickname' gridWidth={'12'}
                                label={'暱稱'} title={'暱稱'} autoFocus={true}
                                value={userProfile.nickname} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='name' gridWidth={'12'}
                                label={'姓名'} title={'姓名'}
                                value={userProfile.name} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapRadios
                                ref='gender' gridWidth={'12'}
                                label={'性別'} options={[
                                    {key: '1', display: '男'},
                                    {key: '0', display: '女'},
                                ]}
                                value={userProfile.gender} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapDateInput
                                ref='birthday' gridWidth={'12'}
                                label={'生日'} yearRange={[1900, (new Date().getFullYear())]}
                                value={userProfile.birthday} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='phoneNumber' gridWidth={'12'} type={'number'}
                                label={'手機號碼'} title={'手機號碼'} readOnly={true}
                                value={userProfile.phoneNumber} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='email' gridWidth={'12'} type={'email'}
                                label={'電子郵件'} title={'電子郵件'}
                                value={userProfile.email} onChange={this.onChange}
                            />
                        </div>
                        <div className='row'>
                            <BootstrapInput
                                ref='postcode' gridWidth={'3'} type={'number'}
                                label={'郵遞區號'} title={'郵遞區號'}
                                value={userProfile.postcode} onChange={this.onChange}
                            />
                            <BootstrapSelect
                                ref='city' gridWidth={'3'} label={'縣市'} title={'縣市'}
                                options={cities} value={userProfile.city} onChange={this.onChange}
                            />
                            <BootstrapInput
                                ref='address' gridWidth={'6'} label={'地址'} title={'地址'}
                                value={userProfile.address} onChange={this.onChange}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className='user-info-form-buttons row'>
                        <div
                            className={ClassNames(
                                'user-info-form-button primary col-md-4 col-md-offset-1'
                            )}
                            role='button' onClick={this.submit}
                        >儲存</div>
                        <div
                            className='user-info-form-button col-md-4 col-md-offset-2'
                            role='button' onClick={this.cancel}
                        >回上一頁</div>
                    </div>
                </div>
                <div className='paper-shadow'></div>
            </div>
            <ConnectedFooter />
        </div>;
    }
}
module.exports = App;
