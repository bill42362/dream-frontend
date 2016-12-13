var Core = require('./Core.js');
var Request = require('request');
var EventCenter = require('./EventCenter.js');

if(undefined === window.PBPlus) { window.PBPlus = function() {}; };
PBPlus.Dream = function() {
    this.apiBase = 'https://g46grc5kd1.execute-api.ap-southeast-2.amazonaws.com/';
    this.apiStage = 'testing/';
    this.adminToken = 'TEST_STRING';
	return this;
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
        timestamp: timelineItem.timestamp,
        visible: timelineItem.visible,
        type: 'timeline',
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
                response.options = response.options
                    .map(this.reformOption);
                response.timelineItems = (response.progress || [])
                    .filter(progress => 'timeline' === progress.type)
                    .map(this.reformTimelineItem);
            }
            successCallback(response);
        }.bind(this),
        error: errorCallback
	});
}

PBPlus.Dream.prototype.getProjects = function(search, offset, limit, errorCallback, successCallback) {
    var searchString = '';
    if(!!search) { searchString = '/' + search; }
    searchString += '?offset=' + (offset || '0');
    if(!!limit) { searchString += '&limit=' + limit; }
	$.ajax({
        url: this.apiBase + this.apiStage + 'readAll' + searchString,
        type: 'post', dataType: 'json', data: {token: this.adminToken},
        success: function(response) {
            if(200 === response.status) {
                var projects = response.message;
                projects = projects.map(this.reformProject);
                response.message = projects;
            }
            successCallback(response);
        }.bind(this),
        error: errorCallback
	});
}

module.exports = PBPlus.Dream;
