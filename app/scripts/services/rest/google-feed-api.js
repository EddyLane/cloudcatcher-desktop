'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.GoogleFeedApi
 * @description
 * # GoogleFeedApi
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')

    .factory('GoogleFeedApi', function ItunesPodcastApi(Restangular, ITUNES_URL, $filter, GOOGLE_FEED_URL, xmlParser, $log) {

        var utils = {
            xmlToJson: function (xml) {
                var obj = {};
                if (xml.nodeType == 1) {
                    if (xml.attributes.length > 0) {
                        obj["@attributes"] = {};
                        for (var j = 0; j < xml.attributes.length; j++) {
                            var attribute = xml.attributes.item(j);
                            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                        }
                    }
                } else if (xml.nodeType == 3) {
                    obj = xml.nodeValue;
                }
                if (xml.hasChildNodes()) {
                    for (var i = 0; i < xml.childNodes.length; i++) {
                        var item = xml.childNodes.item(i);
                        var nodeName = item.nodeName;
                        if (typeof (obj[nodeName]) == "undefined") {
                            obj[nodeName] = this.xmlToJson(item);
                        } else {
                            if (typeof (obj[nodeName].push) == "undefined") {
                                var old = obj[nodeName];
                                obj[nodeName] = [];
                                obj[nodeName].push(old);
                            }
                            obj[nodeName].push(this.xmlToJson(item));
                        }
                    }
                }
                return obj;
            }
        };

        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setJsonp(true);
            RestangularConfigurer.setBaseUrl(GOOGLE_FEED_URL);
            RestangularConfigurer.setDefaultRequestParams('jsonp', { callback: 'JSON_CALLBACK', v: '1.0', num: '1000', output: 'json_xml' });
            RestangularConfigurer.addResponseInterceptor(function (data) {

                var parsed,
                    result;

                if (!data.responseData.xmlString) {
                    var errorString = 'feed.responseData has no "xmlString" property';
                    $log.error(errorString);
                    deferred.reject(new Error(errorString));
                }

                parsed = utils.xmlToJson(xmlParser.parse(data.responseData.xmlString)).rss.channel;

                // Map podcast

                result = {};

                if (parsed['title']) {
                    result.title = parsed['title']['#text'];
                }

                if (parsed['itunes:author']) {
                    result.author = parsed['itunes:author']['#text'];
                }

                if (parsed['itunes:image']) {
                    result.image = parsed['itunes:image']['@attributes']['href'];
                }

                if (parsed['itunes:summary']) {
                    result.summary = parsed['itunes:summary']['#text']
                }

                if (parsed['itunes:keywords'] && parsed['itunes:keywords']['#text']) {
                    result.keywords = parsed['itunes:keywords']['#text'].split(',').map(function (el) {
                        return el.trim();
                    });
                }

                // Map episodes.

                if (!parsed.item) {

                    $log.warn('feed has no "item" property');

                    parsed = {
                        item: []
                    };
                }
                else if (!angular.isArray(parsed.item)) {
                    parsed.item = [parsed.item];
                }

                result.episodes = parsed.item.map(function (episode) {

                    var row = {
                        title: episode['title']['#text'],
                        image: result.image,
                        author: result.author,
                        unplayed: true
                    };

                    if (episode['enclosure']) {
                        row.media = {
                            size: episode['enclosure']['@attributes']['length'],
                            url: episode['enclosure']['@attributes']['url']
                        };
                    }

                    if (episode['content:encoded']) {
                        row.content_encoded = episode['content:encoded']['#text'];
                    }

                    if (episode['itunes:summary']) {
                        row.content = episode['itunes:summary']['#text'];
                    }

                    if (episode['itunes:duration']) {
                        row.length = episode['itunes:duration']['#text'];
                    }

                    if (episode['dc:date']) {
                        row.date = episode['dc:date']['#text'];
                    }

                    return row;

                });

                return result;
            });
        });
    });
