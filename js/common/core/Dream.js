var Core = require('./Core.js');
var Request = require('request');
var EventCenter = require('./EventCenter.js');

if(undefined === window.PBPlus) { window.PBPlus = function() {}; };
PBPlus.Dream = function() {
    this.apiBase = 'https://g46grc5kd1.execute-api.ap-southeast-2.amazonaws.com/';
    this.apiStage = 'testing/';
    this.userToken = '';
    this.userSapId = '';
    this.getUserSapId();
	return this;
}

PBPlus.Dream.prototype.getProjectIdFromUrl = function() {
    let searches = Core.getUrlSearches();
    let pathname = location.pathname;
    let projectId = searches.p
        || location.pathname.match('(?:/project)*/([a-zA-Z0-9-]{1,36})')[1]
        || location.pathname.match('(?:/message)*/([a-zA-Z0-9-]{1,36})')[1]
        || location.pathname.match('(?:/timeline)*/([a-zA-Z0-9-]{1,36})')[1];
    return projectId;
}

PBPlus.Dream.prototype.readProfiles = function(sapIds, errorCallback, successCallback) {
    let url = this.apiBase + this.apiStage + 'readProfile';
    let payload = {token: this.userToken, uid: sapIds};
    Request.post(
        {url: url, json: payload,},
        (err, httpResponse, body) => {
            if(err) { errorCallback && errorCallback(err); }
            else {
                let response = JSON.parse(body.errorMessage);
                if(200 === response.status) {
                    successCallback && successCallback(response.message);
                } else { errorCallback && errorCallback('Not found.'); }
            }
        }
    );
}

PBPlus.Dream.prototype.postMessage = function(message, errorCallback, successCallback) {
    let url = this.apiBase + this.apiStage + 'createMessage';
    let payload = Object.assign(message, {token: this.userToken});
    Request.post(
        {url: url, json: payload,},
        (err, httpResponse, body) => {
            if(err) { errorCallback && errorCallback(err); }
            else { successCallback(body); }
        }
    );
}

PBPlus.Dream.prototype.createMessage = function(message, projectId, errorCallback, successCallback) {
    let payload = {
        id: projectId,
        message: [{ timestamp: Date.now(), content: message, authorId: NODE.USER_ID, }],
    };
    this.postMessage(payload, errorCallback, successCallback);
}

PBPlus.Dream.prototype.replyMessage = function(message, messageUuid, projectId, errorCallback, successCallback) {
    this.getProject(projectId, errorCallback, (response) => {
        let replyingMessage = response.messages.filter(message => {
            return message.uuid === messageUuid;
        })[0];
        if(replyingMessage) {
            let payload = this.conformMessage(replyingMessage);
            payload.message.push({timestamp: Date.now(), content: message, authorId: NODE.USER_ID});
            this.postMessage(payload, errorCallback, successCallback);
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
        id: project.pid,
        title: project.project_name,
        subtitle: project.subtitle,
        description: project.description,
        foundTarget: project.total_amount,
        currentFound: project.sum,
        founderCount: project.num,
        startTimestamp: project.start_timestamp,
        dueTimestamp: project.end_timestamp,
        awares: JSON.parse(project.awares || '[]').slice(0, 6),
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
        title: option.title,
        description: option.content,
        price: option.amount,
        sponsorCount: option.num,
        paymentMethods: option.payment.split(','),
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
	$.ajax({
        url: this.apiBase + this.apiStage + 'read/' + projectId,
        type: 'get', dataType: 'json', data: undefined,
        success: function(response) {
            if(200 === response.status) {
                response.message = [this.reformProject(response.message[0])];
                response.stories = (response.progress || [])
                    .filter(progress => 'story' === progress.type)
                    .map(this.reformStory);
                response.items = response.options
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
        }.bind(this),
        error: errorCallback
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

PBPlus.Dream.prototype.getProjects = function(search, offset, limit, errorCallback, successCallback) {
    var searchString = '';
    if(!!search) { searchString = '/' + search; }
    searchString += '?offset=' + (offset || '0');
    if(!!limit) { searchString += '&limit=' + limit; }
    let url = this.apiBase + this.apiStage + 'read' + searchString;
    Request.get({url: url}, (err, httpResponse, body) => {
        if(err) { errorCallback && errorCallback(err); }
        else {
            if(200 === body.status) {
                var projects = body.message;
                projects = projects.map(this.reformProject);
                body.message = projects;
            }
            successCallback && successCallback(body);
        }
    });
}

module.exports = PBPlus.Dream;
