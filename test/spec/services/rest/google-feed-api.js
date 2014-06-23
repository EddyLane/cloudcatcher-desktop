'use strict';

describe('Service: GoogleFeedApi', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var Restangular,
        callback,
        interceptorCallback,
        configurer;

    beforeEach(function () {
        module(function ($provide) {
            $provide.constant('GOOGLE_FEED_URL', 'google_feed_url');
        })
    });

    beforeEach(inject(function (_Restangular_) {

        Restangular = _Restangular_;

        sinon.stub(Restangular, 'withConfig', function (cb) {
            callback = cb;
            return true;
        });

        configurer = {
            setJsonp: sinon.spy(),
            setDefaultRequestParams: sinon.spy(),
            setBaseUrl: sinon.spy(),
            addResponseInterceptor: function () {}
        };

        sinon.stub(configurer, 'addResponseInterceptor', function (cb) {
            interceptorCallback = cb;
            return true;
        })

    }));

    afterEach(function () {
        Restangular.withConfig.restore();
    });

    it('should exist', inject(function (GoogleFeedApi) {
        expect(GoogleFeedApi).to.exist;
    }));

    describe('Basic configuration', function () {

        it('should return Restangular with config', inject(function (GoogleFeedApi) {
            expect(Restangular.withConfig).to.have.been.called;
        }));

        it('should set Jsonp to true', inject(function (GoogleFeedApi) {
            callback(configurer);
            expect(configurer.setJsonp).to.have.been.calledWithExactly(true);
        }));

        it('should set the default request params', inject(function (GoogleFeedApi) {
            callback(configurer);
            expect(configurer.setDefaultRequestParams).to.have.been.calledWithExactly('jsonp', { callback: 'JSON_CALLBACK', v: '1.0', num: '1000', output: 'json_xml' });
        }));

        it('should set the base url to that specified in a constant', inject(function (GoogleFeedApi) {
            callback(configurer);
            expect(configurer.setBaseUrl).to.have.been.calledWithExactly('google_feed_url');
        }));

    });

    describe('Interceptors and formatters', function () {

        var response = {"responseData": {"xmlString":"\u003c?xml version\u003d\"1.0\" encoding\u003d\"UTF-8\"?\u003e\r\n\u003crss xmlns:dc\u003d\"http://purl.org/dc/elements/1.1/\" xmlns:atom\u003d\"http://www.w3.org/2005/Atom\" xmlns:itunes\u003d\"http://www.itunes.com/dtds/podcast-1.0.dtd\" xmlns:media\u003d\"http://search.yahoo.com/mrss/\" xmlns:ppg\u003d\"http://bbc.co.uk/2009/01/ppgRss\" version\u003d\"2.0\"\u003e\u003cchannel\u003e\u003ctitle\u003eClare Balding's Sunday Best\u003c/title\u003e\u003clink\u003ehttp://www.bbc.co.uk/programmes/b006wqvh\u003c/link\u003e\u003cdescription\u003eClare Balding talks to guests about their life and beliefs exploring, through conversation, matters of faith and spirituality . First broadcast each Sunday morning on Good Morning Sunday with Clare Balding, she interviews a wide variety of guests from the worlds of entertainment, music, the arts, business, sport and politics. Conversations will be around 20 minutes duration and will range from life stories, to inspirational and motivational anecdotes.\u003c/description\u003e\u003clanguage\u003een-gb\u003c/language\u003e\u003ccopyright\u003e(C) BBC 2014\u003c/copyright\u003e\u003cdc:language\u003een-gb\u003c/dc:language\u003e\u003cdc:rights\u003e(C) BBC 2014\u003c/dc:rights\u003e\u003cdc:date\u003eSun, 22 Jun 2014 09:30:12 +0100\u003c/dc:date\u003e\u003cpubDate\u003eSun, 22 Jun 2014 09:30:12 +0100\u003c/pubDate\u003e\u003citem\u003e\u003ctitle\u003egms: Baroness Trumpington 22 JUN 14\u003c/title\u003e\u003clink\u003ehttp://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140622-0902a.mp3\u003c/link\u003e\u003citunes:subtitle\u003eBaroness Trumpington is one of this country's longest serving peers in the House of Lords. She was born Jean Campbell-Harris in 1922, and during the Second World War served with naval intelligence at Bletchley Park. In the 1970s she was involved in...\u003c/itunes:subtitle\u003e\u003citunes:summary\u003eBaroness Trumpington is one of this country's longest serving peers in the House of Lords. She was born Jean Campbell-Harris in 1922, and during the Second World War served with naval intelligence at Bletchley Park. In the 1970s she was involved in local politics, eventually becoming Mayor of Cambridge before being elevated to the House of Lords by the then Prime Minister, Margaret Thatcher. Her Memoir 'Coming Up Trumps' (Macmillan) was published in April\u003c/itunes:summary\u003e\u003citunes:duration\u003e14:37\u003c/itunes:duration\u003e\u003cmedia:content url\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140622-0902a.mp3\" fileSize\u003d\"7092662\" type\u003d\"audio/mpeg\" medium\u003d\"audio\" expression\u003d\"full\" duration\u003d\"877\" /\u003e\u003citunes:author\u003eBBC Radio 2\u003c/itunes:author\u003e\u003cdescription\u003eBaroness Trumpington is one of this country's longest serving peers in the House of Lords. She was born Jean Campbell-Harris in 1922, and during the Second World War served with naval intelligence at Bletchley Park. In the 1970s she was involved in local politics, eventually becoming Mayor of Cambridge before being elevated to the House of Lords by the then Prime Minister, Margaret Thatcher. Her Memoir 'Coming Up Trumps' (Macmillan) was published in April\u003c/description\u003e\u003cenclosure url\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140622-0902a.mp3\" length\u003d\"7092662\" type\u003d\"audio/mpeg\" /\u003e\u003cguid isPermaLink\u003d\"false\"\u003ehttp://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140622-0902.mp3\u003c/guid\u003e\u003cdc:date\u003eSun, 22 Jun 2014 09:02:00 +0100\u003c/dc:date\u003e\u003cpubDate\u003eSun, 22 Jun 2014 09:02:00 +0100\u003c/pubDate\u003e\u003c/item\u003e\u003citem\u003e\u003ctitle\u003egms: Rev Mpho Tutu 15 JUN 14\u003c/title\u003e\u003clink\u003ehttp://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140615-0900a.mp3\u003c/link\u003e\u003citunes:subtitle\u003eThe Reverend Mphu Tutu is an Episcopal Priest and Executive Director of The Desmond \u0026amp; Leah Tutu Legacy Foundation. She's the daughter of Archbishop Desmond Tutu who chaired South Africa's Truth and Reconciliation Commission, and with whom she has...\u003c/itunes:subtitle\u003e\u003citunes:summary\u003eThe Reverend Mphu Tutu is an Episcopal Priest and Executive Director of The Desmond \u0026amp; Leah Tutu Legacy Foundation. She's the daughter of Archbishop Desmond Tutu who chaired South Africa's Truth and Reconciliation Commission, and with whom she has co-authored \"The Book of Forgiving\", published in April. At the beginning of May they launched together \"The Tutu Global Forgiveness Challenge\" to help everyone learn how to forgive and see the benefits of forgiveness in their own lives.\u003c/itunes:summary\u003e\u003citunes:duration\u003e14:55\u003c/itunes:duration\u003e\u003cmedia:content url\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140615-0900a.mp3\" fileSize\u003d\"7237201\" type\u003d\"audio/mpeg\" medium\u003d\"audio\" expression\u003d\"full\" duration\u003d\"895\" /\u003e\u003citunes:author\u003eBBC Radio 2\u003c/itunes:author\u003e\u003cdescription\u003eThe Reverend Mphu Tutu is an Episcopal Priest and Executive Director of The Desmond \u0026amp; Leah Tutu Legacy Foundation. She's the daughter of Archbishop Desmond Tutu who chaired South Africa's Truth and Reconciliation Commission, and with whom she has co-authored \"The Book of Forgiving\", published in April. At the beginning of May they launched together \"The Tutu Global Forgiveness Challenge\" to help everyone learn how to forgive and see the benefits of forgiveness in their own lives.\u003c/description\u003e\u003cenclosure url\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140615-0900a.mp3\" length\u003d\"7237201\" type\u003d\"audio/mpeg\" /\u003e\u003cguid isPermaLink\u003d\"false\"\u003ehttp://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140615-0900.mp3\u003c/guid\u003e\u003cdc:date\u003eSun, 15 Jun 2014 09:00:00 +0100\u003c/dc:date\u003e\u003cpubDate\u003eSun, 15 Jun 2014 09:00:00 +0100\u003c/pubDate\u003e\u003c/item\u003e\u003citem\u003e\u003ctitle\u003egms: Randy Lewis 08 Jun 14\u003c/title\u003e\u003clink\u003ehttp://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140607-1838a.mp3\u003c/link\u003e\u003citunes:subtitle\u003eRandy Lewis is a businessman who was inspired by his son Austin - who has autism - to create a workplace where people with disabilities don't just succeed, but thrive. Randy's book, \"No Greatness Without Goodness\" tells the story of his campaign and...\u003c/itunes:subtitle\u003e\u003citunes:summary\u003eRandy Lewis is a businessman who was inspired by his son Austin - who has autism - to create a workplace where people with disabilities don't just succeed, but thrive. Randy's book, \"No Greatness Without Goodness\" tells the story of his campaign and how he rolled out the initiative, not just in the US Walgreen retail stores, but worldwide with companies such as P \u0026amp; G, Marks \u0026amp; Spencer and Boots in the UK.\u003c/itunes:summary\u003e\u003citunes:duration\u003e19:50\u003c/itunes:duration\u003e\u003cmedia:content url\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140607-1838a.mp3\" fileSize\u003d\"9597463\" type\u003d\"audio/mpeg\" medium\u003d\"audio\" expression\u003d\"full\" duration\u003d\"1190\" /\u003e\u003citunes:author\u003eBBC Radio 2\u003c/itunes:author\u003e\u003cdescription\u003eRandy Lewis is a businessman who was inspired by his son Austin - who has autism - to create a workplace where people with disabilities don't just succeed, but thrive. Randy's book, \"No Greatness Without Goodness\" tells the story of his campaign and how he rolled out the initiative, not just in the US Walgreen retail stores, but worldwide with companies such as P \u0026amp; G, Marks \u0026amp; Spencer and Boots in the UK.\u003c/description\u003e\u003cenclosure url\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140607-1838a.mp3\" length\u003d\"9597463\" type\u003d\"audio/mpeg\" /\u003e\u003cguid isPermaLink\u003d\"false\"\u003ehttp://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140607-1838.mp3\u003c/guid\u003e\u003cdc:date\u003eSat, 07 Jun 2014 18:38:00 +0100\u003c/dc:date\u003e\u003cpubDate\u003eSat, 07 Jun 2014 18:38:00 +0100\u003c/pubDate\u003e\u003c/item\u003e\u003citem\u003e\u003ctitle\u003egms: Rhydian 01 June 14\u003c/title\u003e\u003clink\u003ehttp://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140606-1710a.mp3\u003c/link\u003e\u003citunes:subtitle\u003eClare Balding chats to Welsh classical singer, Rhydian who shot to fame after becoming a runner up on the X Factor. His 5th studio album was released in March this year....\u003c/itunes:subtitle\u003e\u003citunes:summary\u003eClare Balding chats to Welsh classical singer, Rhydian who shot to fame after becoming a runner up on the X Factor. His 5th studio album was released in March this year.\u003c/itunes:summary\u003e\u003citunes:duration\u003e15:06\u003c/itunes:duration\u003e\u003cmedia:content url\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140606-1710a.mp3\" fileSize\u003d\"7326561\" type\u003d\"audio/mpeg\" medium\u003d\"audio\" expression\u003d\"full\" duration\u003d\"906\" /\u003e\u003citunes:author\u003eBBC Radio 2\u003c/itunes:author\u003e\u003cdescription\u003eClare Balding chats to Welsh classical singer, Rhydian who shot to fame after becoming a runner up on the X Factor. His 5th studio album was released in March this year.\u003c/description\u003e\u003cenclosure url\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140606-1710a.mp3\" length\u003d\"7326561\" type\u003d\"audio/mpeg\" /\u003e\u003cguid isPermaLink\u003d\"false\"\u003ehttp://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140606-1710.mp3\u003c/guid\u003e\u003cdc:date\u003eFri, 06 Jun 2014 17:10:00 +0100\u003c/dc:date\u003e\u003cpubDate\u003eFri, 06 Jun 2014 17:10:00 +0100\u003c/pubDate\u003e\u003c/item\u003e\u003citem\u003e\u003ctitle\u003egms: Rosanne Cash 25 May 14\u003c/title\u003e\u003clink\u003ehttp://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140525-0930a.mp3\u003c/link\u003e\u003citunes:subtitle\u003eClare talks to American singer-songwriter Rosanne Cash whose latest album \"The River and The Thread\" was released in February. It took her seven years to gather material for it and, like her two previous albums, it’s strongly influenced by the loss of...\u003c/itunes:subtitle\u003e\u003citunes:summary\u003eClare talks to American singer-songwriter Rosanne Cash whose latest album \"The River and The Thread\" was released in February. It took her seven years to gather material for it and, like her two previous albums, it’s strongly influenced by the loss of her mother, step-mother and her famous father, Johnny Cash. It’s full of musical influences from the Southern states of the USA – not just country, but blues, Gospel and slave songs.\u003c/itunes:summary\u003e\u003citunes:duration\u003e13:43\u003c/itunes:duration\u003e\u003cmedia:content url\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140525-0930a.mp3\" fileSize\u003d\"6664116\" type\u003d\"audio/mpeg\" medium\u003d\"audio\" expression\u003d\"full\" duration\u003d\"823\" /\u003e\u003citunes:author\u003eBBC Radio 2\u003c/itunes:author\u003e\u003cdescription\u003eClare talks to American singer-songwriter Rosanne Cash whose latest album \"The River and The Thread\" was released in February. It took her seven years to gather material for it and, like her two previous albums, it’s strongly influenced by the loss of her mother, step-mother and her famous father, Johnny Cash. It’s full of musical influences from the Southern states of the USA – not just country, but blues, Gospel and slave songs.\u003c/description\u003e\u003cenclosure url\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140525-0930a.mp3\" length\u003d\"6664116\" type\u003d\"audio/mpeg\" /\u003e\u003cguid isPermaLink\u003d\"false\"\u003ehttp://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140525-0930.mp3\u003c/guid\u003e\u003cdc:date\u003eSun, 25 May 2014 09:30:00 +0100\u003c/dc:date\u003e\u003cpubDate\u003eSun, 25 May 2014 09:30:00 +0100\u003c/pubDate\u003e\u003c/item\u003e\u003citunes:summary\u003eClare Balding talks to guests about their life and beliefs exploring, through conversation, matters of faith and spirituality . First broadcast each Sunday morning on Good Morning Sunday with Clare Balding, she interviews a wide variety of guests from the worlds of entertainment, music, the arts, business, sport and politics. Conversations will be around 20 minutes duration and will range from life stories, to inspirational and motivational anecdotes.\u003c/itunes:summary\u003e\u003citunes:author\u003eBBC Radio 2\u003c/itunes:author\u003e\u003citunes:owner\u003e\u003citunes:name\u003eBBC\u003c/itunes:name\u003e\u003citunes:email\u003epodcast.support@bbc.co.uk\u003c/itunes:email\u003e\u003c/itunes:owner\u003e\u003cppg:systemRef systemId\u003d\"pid.brand\" key\u003d\"b006wqvh\" /\u003e\u003cppg:systemRef systemId\u003d\"pid.format\" key\u003d\"PT004\" /\u003e\u003cppg:systemRef systemId\u003d\"pid.genre\" key\u003d\"C00080\" /\u003e\u003cppg:network id\u003d\"radio2\" name\u003d\"BBC Radio 2\" /\u003e\u003cppg:seriesDetails typicalDuration\u003d\"PT18M\" active\u003d\"true\" public\u003d\"true\" region\u003d\"all\" launchDate\u003d\"2014-03-07\" frequency\u003d\"weekly\" daysLive\u003d\"30\" liveItems\u003d\"5\" /\u003e\u003citunes:image href\u003d\"http://www.bbc.co.uk/podcasts/assets/artwork/gms.jpg\" /\u003e\u003citunes:category text\u003d\"Religion \u0026amp; Spirituality\" /\u003e\u003citunes:keywords\u003eGood Morning Sunday, Claire, Blading, GMS, sports, presenter, religion, faith, belief, spirituality, BBC, Clair, Baldwin\u003c/itunes:keywords\u003e\u003cmedia:keywords\u003eGood Morning Sunday, Claire, Blading, GMS, sports, presenter, religion, faith, belief, spirituality, BBC, Clair, Baldwin\u003c/media:keywords\u003e\u003citunes:explicit\u003eno\u003c/itunes:explicit\u003e\u003cmedia:rating scheme\u003d\"urn:simple\"\u003enonadult\u003c/media:rating\u003e\u003catom:link href\u003d\"http://downloads.bbc.co.uk/podcasts/radio2/gms/rss.xml\" rel\u003d\"self\" type\u003d\"application/rss+xml\" /\u003e\u003c/channel\u003e\u003c/rss\u003e\r\n","feed":{"feedUrl":"http://downloads.bbc.co.uk/podcasts/radio2/gms/rss.xml","title":"Clare Balding's Sunday Best","link":"http://www.bbc.co.uk/programmes/b006wqvh","author":"","description":"Clare Balding talks to guests about their life and beliefs exploring, through conversation, matters of faith and spirituality .  \r\n\r\nFirst broadcast each Sunday morning  on Good Morning Sunday with Clare Balding, she interviews a wide variety of guests from the worlds of entertainment, music, the arts, business, sport and politics.  \r\n\r\nConversations will be around 20 minutes duration and will range from life stories, to inspirational and motivational anecdotes.","type":"rss20","entries":[{"mediaGroups":[{"contents":[{"url":"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140622-0902a.mp3","fileSize":"7092662","type":"audio/mpeg","medium":"audio","expression":"full","duration":877.0}]}],"title":"gms: Baroness Trumpington 22 JUN 14","link":"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140622-0902a.mp3","author":"","publishedDate":"Sun, 22 Jun 2014 01:02:00 -0700","contentSnippet":"Baroness Trumpington is one of this country's longest serving peers in the House of Lords. She was born Jean Campbell-Harris in ...","content":"Baroness Trumpington is one of this country's longest serving peers in the House of Lords. She was born Jean Campbell-Harris in 1922, and during the Second World War served with naval intelligence at Bletchley Park. In the 1970s she was involved in local politics, eventually becoming Mayor of Cambridge before being elevated to the House of Lords by the then Prime Minister, Margaret Thatcher. Her Memoir 'Coming Up Trumps' (Macmillan) was published in April","categories":[]},{"mediaGroups":[{"contents":[{"url":"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140615-0900a.mp3","fileSize":"7237201","type":"audio/mpeg","medium":"audio","expression":"full","duration":895.0}]}],"title":"gms: Rev Mpho Tutu 15 JUN 14","link":"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140615-0900a.mp3","author":"","publishedDate":"Sun, 15 Jun 2014 01:00:00 -0700","contentSnippet":"The Reverend Mphu Tutu is an Episcopal Priest and Executive Director of The Desmond \u0026 Leah Tutu Legacy Foundation. She's the ...","content":"The Reverend Mphu Tutu is an Episcopal Priest and Executive Director of The Desmond \u0026amp; Leah Tutu Legacy Foundation. She\u0026#39;s the daughter of Archbishop Desmond Tutu who chaired South Africa\u0026#39;s Truth and Reconciliation Commission, and with whom she has co-authored \u0026quot;The Book of Forgiving\u0026quot;, published in April. At the beginning of May they launched together \u0026quot;The Tutu Global Forgiveness Challenge\u0026quot; to help everyone learn how to forgive and see the benefits of forgiveness in their own lives.","categories":[]},{"mediaGroups":[{"contents":[{"url":"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140607-1838a.mp3","fileSize":"9597463","type":"audio/mpeg","medium":"audio","expression":"full","duration":1190.0}]}],"title":"gms: Randy Lewis 08 Jun 14","link":"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140607-1838a.mp3","author":"","publishedDate":"Sat, 07 Jun 2014 10:38:00 -0700","contentSnippet":"Randy Lewis is a businessman who was inspired by his son Austin  - who has autism - to create a workplace where people with ...","content":"Randy Lewis is a businessman who was inspired by his son Austin  - who has autism - to create a workplace where people with disabilities don\u0026#39;t just succeed, but thrive.  Randy\u0026#39;s book, \u0026quot;No Greatness Without Goodness\u0026quot; tells the story of his campaign and how he rolled out the initiative, not just in the US Walgreen retail stores, but worldwide with companies such as P \u0026amp; G, Marks \u0026amp; Spencer and Boots in the UK.","categories":[]},{"mediaGroups":[{"contents":[{"url":"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140606-1710a.mp3","fileSize":"7326561","type":"audio/mpeg","medium":"audio","expression":"full","duration":906.0}]}],"title":"gms: Rhydian 01 June 14","link":"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140606-1710a.mp3","author":"","publishedDate":"Fri, 06 Jun 2014 09:10:00 -0700","contentSnippet":"Clare Balding chats to Welsh classical singer, Rhydian who shot to fame after becoming a runner up on the X Factor. His 5th ...","content":"Clare Balding chats to Welsh classical singer, Rhydian who shot to fame after becoming a runner up on the X Factor. His 5th studio album was released in March this year.","categories":[]},{"mediaGroups":[{"contents":[{"url":"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140525-0930a.mp3","fileSize":"6664116","type":"audio/mpeg","medium":"audio","expression":"full","duration":823.0}]}],"title":"gms: Rosanne Cash 25 May 14","link":"http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140525-0930a.mp3","author":"","publishedDate":"Sun, 25 May 2014 01:30:00 -0700","contentSnippet":"Clare talks to American singer-songwriter Rosanne Cash whose latest album \"The River and The Thread\" was released in February. ...","content":"Clare talks to American singer-songwriter Rosanne Cash whose latest album \"The River and The Thread\" was released in February. It took her seven years to gather material for it and, like her two previous albums, it’s strongly influenced by the loss of her mother, step-mother and her famous father, Johnny Cash. It’s full of musical influences from the Southern states of the USA – not just country, but blues, Gospel and slave songs.","categories":[]}]}}, "responseDetails": null, "responseStatus": 200};

        it('should set add one response interceptor', inject(function (GoogleFeedApi) {
            callback(configurer);
            expect(configurer.addResponseInterceptor).to.have.been.calledOnce;
            expect(configurer.addResponseInterceptor).to.have.been.calledWithExactly(interceptorCallback);
        }));

        it('should set the title of the podcast in the response', inject(function (GoogleFeedApi) {
            var result;
            callback(configurer);
            result = interceptorCallback(response);
            expect(result.meta.title).to.equal('Clare Balding\'s Sunday Best');
        }));

        it('should set the author of the podcast in the response', inject(function (GoogleFeedApi) {
            var result;
            callback(configurer);
            result = interceptorCallback(response);
            expect(result.meta.author).to.equal('BBC Radio 2');
        }));

        it('should set the image of the podcast', inject(function (GoogleFeedApi) {
            var result;
            callback(configurer);
            result = interceptorCallback(response);
            expect(result.meta.image).to.equal('http://www.bbc.co.uk/podcasts/assets/artwork/gms.jpg');
        }));

        it('should set the summary of the podcast', inject(function (GoogleFeedApi) {
            var result;
            callback(configurer);
            result = interceptorCallback(response);
            expect(result.meta.summary).to.equal('Clare Balding talks to guests about their life and beliefs exploring, through conversation, matters of faith and spirituality . First broadcast each Sunday morning on Good Morning Sunday with Clare Balding, she interviews a wide variety of guests from the worlds of entertainment, music, the arts, business, sport and politics. Conversations will be around 20 minutes duration and will range from life stories, to inspirational and motivational anecdotes.');
        }));

        it('should set the keywords of the podcast', inject(function (GoogleFeedApi) {
            var result;
            callback(configurer);
            result = interceptorCallback(response);
            expect(result.meta.keywords).to.deep.equal(['Good Morning Sunday', 'Claire', 'Blading', 'GMS', 'sports', 'presenter', 'religion', 'faith', 'belief', 'spirituality', 'BBC', 'Clair', 'Baldwin']);
        }));


        describe('Parsing episodes', function () {

            it('should parse the correct amount of episodes', inject(function (GoogleFeedApi) {
                var result;
                callback(configurer);
                result = interceptorCallback(response);
                expect(result).to.have.length(5);
            }));

            it('should set the title of the episode', inject(function (GoogleFeedApi) {
                var result;
                callback(configurer);
                result = interceptorCallback(response);
                expect(result[0].title).to.equal('gms: Baroness Trumpington 22 JUN 14');
            }));

            it('should set the image of the episode', inject(function (GoogleFeedApi) {
                var result;
                callback(configurer);
                result = interceptorCallback(response);
                expect(result[0].image).to.equal('http://www.bbc.co.uk/podcasts/assets/artwork/gms.jpg');
            }));

            it('should set the author of the episode', inject(function (GoogleFeedApi) {
                var result;
                callback(configurer);
                result = interceptorCallback(response);
                expect(result[0].author).to.equal('BBC Radio 2');
            }));

            it('should set the unplayed property of the episode to true', inject(function (GoogleFeedApi) {
                var result;
                callback(configurer);
                result = interceptorCallback(response);
                expect(result[0].unplayed).to.be.true;
            }));

            it('should set the content of the episode', inject(function (GoogleFeedApi) {
                var result;
                callback(configurer);
                result = interceptorCallback(response);
                expect(result[0].content).to.equal("Baroness Trumpington is one of this country's longest serving peers in the House of Lords. She was born Jean Campbell-Harris in 1922, and during the Second World War served with naval intelligence at Bletchley Park. In the 1970s she was involved in local politics, eventually becoming Mayor of Cambridge before being elevated to the House of Lords by the then Prime Minister, Margaret Thatcher. Her Memoir 'Coming Up Trumps' (Macmillan) was published in April");
            }));

            it('should set the length of the episode', inject(function (GoogleFeedApi) {
                var result;
                callback(configurer);
                result = interceptorCallback(response);
                expect(result[0].length).to.equal('14:37');
            }));

            it('should set the date of the episode', inject(function (GoogleFeedApi) {
                var result;
                callback(configurer);
                result = interceptorCallback(response);
                expect(result[0].date).to.equal('Sun, 22 Jun 2014 09:02:00 +0100');
            }));

            it('should set the media property of the episode', inject(function (GoogleFeedApi) {
                var result;
                callback(configurer);
                result = interceptorCallback(response);
                expect(result[0].media).to.deep.equal({
                    size: '7092662',
                    url: 'http://downloads.bbc.co.uk/podcasts/radio2/gms/gms_20140622-0902a.mp3'
                });
            }));


        });

    });

});
