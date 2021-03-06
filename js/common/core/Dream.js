var Core = require('./Core.js');
var Request = require('request');
var RP = require('request-promise');
var EventCenter = require('./EventCenter.js');

if(undefined === window.PBPlus) { window.PBPlus = function() {}; };
PBPlus.Dream = function() {
    this.commonBaseUrl = process.env.COMMON_BASE_URL || 'http://localhost';
    this.apiBase = process.env.API_BASE || 'http://localhost';
    this.userToken = '';
    this.userSapId = '';
    this.getUserSapId();
	return this;
}

PBPlus.Dream.projectTypeDictionary = {
    '0': 'fund', '1': 'bid', '2': 'outer',
    'fund': '0', 'bid': '1', 'outer': '2',
};

PBPlus.Dream.prototype.getHeaderNavs = function() {
    var options = {
        url: this.commonBaseUrl + '/menu/header', json: true,
        transform: function(response) {
            if(200 === response.status) { return response.message; }
            else { return []; }
        },
    };
    return RP(options);
};

PBPlus.Dream.prototype.getProjectIdFromUrl = function() {
    let searches = Core.getUrlSearches();
    let pathname = location.pathname;
    let projectId = searches.p
        || location.pathname.match('(?:/project)*/([a-zA-Z0-9-]{1,36})')[1]
        || location.pathname.match('(?:/message)*/([a-zA-Z0-9-]{1,36})')[1]
        || location.pathname.match('(?:/timeline)*/([a-zA-Z0-9-]{1,36})')[1];
    return projectId;
}

PBPlus.Dream.prototype.createPayment = function({ userUuid, projectId, itemId, paymentData, errorCallback, successCallback }) {
    let url = this.apiBase + '/createPayment';
    let payload = {
        uuid: userUuid,
        pid: projectId,
        oid: itemId,
        basis: paymentData.paymentMethod,
        addressee: paymentData.receipt.title,
        companyID: paymentData.receipt.number,
        address: paymentData.userData.address,
        codezip: paymentData.userData.postcode,
        receiver: paymentData.userData.name,
        phone: paymentData.userData.phoneNumber,
        email: paymentData.userData.email || 'test-api@pcgbros.com',
        comments: paymentData.remark,
    };
    Request.post(
        {url: url, json: payload,},
        (err, httpResponse, body) => {
            if(err) { errorCallback && errorCallback(err); }
            else if(200 === body.status) {
                successCallback && successCallback({
                    tradeNumber: body.tradeNo, html: body.message,
                });
            } else if(401 === body.status && 'status:fail, Sold Out.' === body.message) {
                errorCallback && errorCallback({status: 401, message: '已售完'});
            } else { errorCallback && errorCallback({status: 500, message: 'Not Found.'}); }
        }
    );
}

PBPlus.Dream.prototype.cancelOrder = function({ userUuid, tradeNumber, errorCallback, successCallback }) {
    let url = this.apiBase + '/cancelOrder/' + tradeNumber;
    let payload = { uuid: userUuid };
    Request.put(
        {url: url, json: payload},
        (err, httpResponse, response) => {
            if(err) { errorCallback && errorCallback(err); }
            else if(200 === response.status) {
                successCallback && successCallback(response);
            } else { errorCallback && errorCallback({status: 500, message: 'Not Found.'}); }
        }
    );
}

PBPlus.Dream.prototype.reformProfile = function(profile) {
    return {
        userPK: profile.userPK,
        pictureSrc: profile.src,
        nickname: profile.nickname,
        name: profile.name,
        gender: profile.gender,
        birthday: profile.birthday,
        phoneNumber: profile.mobile,
        email: profile.email,
        postcode: profile.zipcode,
        city: profile.city,
        address: profile.address,
    };
}

PBPlus.Dream.prototype.conformProfile = function(profile) {
    return {
        picture: profile.pictureSrc,
        nickname: profile.nickname,
        name: profile.name,
        gender: profile.gender,
        birthday: profile.birthday,
        email: profile.email,
        zipcode: profile.postcode,
        city: profile.city,
        address: profile.address,
    };
}

PBPlus.Dream.prototype.readProfiles = function(sapIds, errorCallback, successCallback) {
    let url = this.apiBase + '/readProfile';
    let payload = {token: this.userToken, uid: sapIds};
    Request.post(
        {url: url, json: payload,},
        (err, httpResponse, body) => {
            if(err) { errorCallback && errorCallback(err); }
            else {
                if(200 === body.status) {
                    let profiles = (body.message || []).map(this.reformProfile);
                    successCallback && successCallback(profiles);
                } else { errorCallback && errorCallback('Not found.'); }
            }
        }
    );
}

PBPlus.Dream.prototype.postMessage = function({ message, userUuid, errorCallback, successCallback }) {
    let url = this.apiBase + '/createMessage';
    let payload = Object.assign(message, {author_uuid: userUuid});
    Request.post(
        {url: url, json: payload,},
        (err, httpResponse, body) => {
            if(err) { errorCallback && errorCallback(err); }
            else { successCallback(body); }
        }
    );
}

PBPlus.Dream.prototype.postNewsfeed = function({ message, userUuid, projectId, errorCallback, successCallback }) {
    let url = this.apiBase + '/createNewsfeed';
    let payload = {
        uuid: userUuid, projectId: projectId,
        type: 'message', message: message,
    };
    Request.post(
        {url: url, json: payload,},
        (err, httpResponse, body) => {
            if(err) { errorCallback && errorCallback(err); }
            else { successCallback && successCallback(body); }
        }
    );
}

PBPlus.Dream.prototype.readNewsfeed = function(projectId, errorCallback, successCallback) {
    let url = this.apiBase + '/readNewsfeed';
    if(projectId) { url += `/${projectId}`; }
    Request.get(
        {url: url, json: undefined,},
        (err, httpResponse, body) => {
            if(err) { errorCallback && errorCallback(err); }
            else {
                let response = JSON.parse(body);
                if(200 === response.status) {
                    successCallback && successCallback(response.message);
                } else {
                    errorCallback && errorCallback({status: 500, message: 'Server error.'});
                }
            }
        }
    );
}

PBPlus.Dream.prototype.createMessage = function({ message, userUuid, projectId, errorCallback, successCallback }) {
    let payload = {
        id: projectId,
        message: [{ timestamp: Date.now(), content: message }],
    };
    this.postMessage({ userUuid, errorCallback, successCallback, message: payload});
    this.postNewsfeed({ message, userUuid, projectId });
}

PBPlus.Dream.prototype.replyMessage = function({ message, messageUuid, userUuid, projectId, errorCallback, successCallback }) {
    this.getProject(projectId, errorCallback, (response) => {
        let replyingMessage = response.messages.filter(message => {
            return message.uuid === messageUuid;
        })[0];
        if(replyingMessage) {
            const payload = this.conformMessage(replyingMessage);
            payload.message.push({timestamp: Date.now(), content: message});
            this.postMessage({ userUuid, errorCallback, successCallback, message: payload});
            this.postNewsfeed({ message, userUuid, projectId });
        } else {
            errorCallback({status: 500, message: '內部錯誤'});
        }
    });
}

PBPlus.Dream.prototype.reformProject = (project) => {
    return {
        bannerId: project.cover_img,
        bannerName: project.picture_name,
        bannerData: {
            id: project.cover_img, name: project.picture_name,
            title: project.picture_title, src: project.picture_src, file: '',
        },
        videoUrl: project.video_url,
        id: project.pid,
        type: PBPlus.Dream.projectTypeDictionary[project.type],
        title: project.project_name,
        subtitle: project.subtitle,
        description: project.description,
        foundTarget: project.total_amount,
        currentFound: project.sum,
        founderCount: project.num,
        startTimestamp: project.start_timestamp,
        dueTimestamp: project.end_timestamp,
        awares: JSON.parse(project.awares || '[]').slice(0, 6),
        positions: JSON.parse(project.positions || '[]'),
        relateUrl: project.relate_url,
        willIssueInvoice: !!project.is_invoice,
    };
};

PBPlus.Dream.prototype.reformStory = (story) => {
    return {
        pictureId: story.img,
        pictureName: story.picture_name,
        pictureData: {
            id: story.img, name: story.picture_name,
            title: story.picture_title, src: story.picture_src, file: '',
        },
        id: story.id,
        title: story.title,
        subtitle: story.subtitle,
        description: story.content,
        timestamp: story.timestamp,
        visible: story.visible,
        type: 'story',
    };
};

PBPlus.Dream.prototype.reformOption = (option) => {
    return {
        pictureId: option.img,
        pictureName: option.picture_name,
        pictureData: {
            id: option.img, name: option.picture_name,
            title: option.picture_title, src: option.picture_src, file: '',
        },
        id: option.oid,
        projectId: option.pid,
        title: option.title,
        description: option.content,
        price: option.amount,
        sponsorCount: option.num,
        paymentMethods: option.payment.split(','),
        creditcardPaymentExpireMinutes: option.credit_expire,
        limitedTimestamp: option.timestamp,
        limitedQuantity: option.sets,
        labels: JSON.parse(option.label),
        visible: option.visible,
    };
};

PBPlus.Dream.prototype.reformTimelineItem = (timelineItem) => {
    return {
        pictureId: timelineItem.img,
        pictureName: timelineItem.picture_name,
        pictureData: {
            id: timelineItem.img, name: timelineItem.picture_name,
            title: timelineItem.picture_title, src: timelineItem.picture_src, file: '',
        },
        id: timelineItem.id,
        title: timelineItem.title,
        description: timelineItem.content,
        timestamp: timelineItem.timestamp*1000,
        visible: timelineItem.visible,
        type: 'timeline',
    };
};

PBPlus.Dream.prototype.conformMessage = (message) => {
    return {
        id: message.projectId, uuid: message.uuid, time: message.timestamp,
        message: [{
            timestamp: message.body.timestamp,
            content: message.body.content,
            authorId: message.body.authorId,
        }].concat(message.body.replies),
    };
};

PBPlus.Dream.prototype.reformMessage = (message) => {
    return {
        projectId: message.pid, uuid: message.uuid, timestamp: message.time,
        body: Object.assign(
            message.message[0],
            {replies: message.message.slice(1)}
        ),
    };
};

PBPlus.Dream.prototype.getProject = function(projectId, errorCallback, successCallback) {
    let url = this.apiBase + '/read/' + projectId;
    Request.get({url: url}, (err, httpResponse, body) => {
        if(err) { errorCallback && errorCallback(err); }
        else if(body) {
            let response = JSON.parse(body);
            if(200 === response.status) {
                response.message = [this.reformProject(response.message[0])];
                response.stories = (response.progress || [])
                    .filter(progress => 'story' === progress.type)
                    .map(this.reformStory);
                response.items = (response.options || [])
                    .map(this.reformOption);
                response.timelineItems = (response.progress || [])
                    .filter(progress => 'timeline' === progress.type)
                    .map(this.reformTimelineItem);
                response.messages = (response.comment || {Items: []}).Items
                    .map(this.reformMessage).sort((a, b) => {
                        if(a.timestamp < b.timestamp) { return 1; } else { return -1; }
                    });
            }
            successCallback(response);
        }
    });
}

PBPlus.Dream.prototype.getUserSapId = function(errorCallback, successCallback) {
    let url = location.protocol + '//' + location.host + '/token';
    Request.get({url: url}, (err, httpResponse, body) => {
        if(err) { errorCallback && errorCallback(err); }
        else if(body) {
            let response = JSON.parse(body);
            this.userToken = response.token;
            this.userSapId = response.sapId;
            successCallback && successCallback(response.sapId);
        }
    });
}

PBPlus.Dream.prototype.getUserSapIdPromise = function() {
    let url = location.protocol + '//' + location.host + '/token';
    const options = {
        url: `${location.protocol}//${location.host}/token`,
        json: true,
    };
    return RP(options);
}

PBPlus.Dream.prototype.getProjects = function(search, offset, limit, errorCallback, successCallback) {
    var searchString = '';
    if(!!search) { searchString = '/' + search; }
    searchString += '?offset=' + (offset || '0');
    if(!!limit) { searchString += '&limit=' + limit; }
    let url = this.apiBase + '/read' + searchString;
    Request.get({url: url}, (err, httpResponse, body) => {
        if(err) { errorCallback && errorCallback(err); }
        else {
            let response = JSON.parse(body);
            if(200 === response.status) {
                var projects = response.message;
                projects = projects.map(this.reformProject);
                successCallback && successCallback(projects);
            } else {
                errorCallback && errorCallback({status: 500, message: 'Server Error.'});
            }
        }
    });
}

PBPlus.Dream.prototype.getPayHistory = function({ userUuid }) {
    const options = {
        url: `${this.apiBase}/readOrder`, json: true,
        method: 'post', body: {uuid: userUuid},
        transform: function(response) {
            if(200 === response.status) { return response.message; }
            else { throw new Error('Not Found.'); }
        },
    };
    return RP(options);
}

module.exports = PBPlus.Dream;
