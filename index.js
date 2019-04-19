import './scss/main.scss'
//import Muxy from './_medkit.umd.js'
import Muxy from './_medkit-prod.umd.js'
import $ from './jquery.js'
import _ from './_lodash.min.js'
import Countdown from './_countdown.js'

const appStorage = window.localStorage;
appStorage.setItem('counter', null);
let counterStorage = null;

const opts = new Muxy.DebuggingOptions();
opts.role('viewer').environment('production')
.jwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIxNDA1NjYwMTIsInJvbGUiOiJhZG1pbiIsImNoYW5uZWxfaWQiOiIxMjQ0ODMyNTYiLCJ1c2VyX2lkIjoiMTI0NDgzMjU2Iiwib3BhcXVlX3VzZXJfaWQiOiJVMTI0NDgzMjU2IiwiaWF0IjoxNTQwNTY2MDcyfQ.9dlW4B2FGyXurFqwiMwEgjABJYPSWRT1h2LU9blhwmY');


Muxy.setup({extensionID: 'xyphukhqzv4tl044h0vxdrj945zbpr'});
Muxy.debug(opts);

const sdk = new Muxy.default.SDK();

/**
 * [setVote description]
 * @param {[type]} voteid [description]
 * @param {[type]} answer [description]
 */

/**
 * [getVoteData description]
 * @param  {[type]} voteid [description]
 * @return {[type]}        [description]
 */
const getVoteData = (voteid) => {
  //console.log(`muxy::getVoteData: ${voteid}`);
  return sdk.getVoteData(voteid);
};

/**
 * [listenVote description]
 * @param  {[type]} voteid [description]
 * @return {[type]}        [description]
 */
const listenVote = (voteid, cb) => {
  //console.log(`muxy::listen: vote_update:${voteid}`);
  sdk.listen(`vote_update:${voteid}`, cb);
};

const cleanPoll = (el) => {
  // Hide element
  // Empty Title & Answers
  $('#poll-title').html('');
  $('#poll-answers').empty();
};

const setCountdown = (duration) => {
  const now = new Date();
  const seconds = 1000 * duration;
  const end = new Date(now.getTime() + seconds);
  counterStorage = Countdown.timer(end, function(time) {
    let secs = time.seconds
    if(secs < 10) {
      secs = '0'+secs;
    }
    if(secs < 0) {
      secs = '00';
    }
    if (time.minutes > 0) {
      $('#duration').html(`${time.minutes}:${secs}`);
    } else {
      $('#duration').html(secs);
    }
  },function() {
    $('#duration').html('00:00');
  });
  appStorage.setItem('counter', counterStorage);
  return counterStorage;
};

/**
 * [generatePoll description]
 * @param  {[type]} poll [description]
 * @return {[type]}      [description]
 */
const generatePoll = (poll) => {
  //console.log(poll);
  $('#poll-title').html(poll.question);
  $('#duration').html('00:00');
  setCountdown(poll.duration)
  if(poll.type == "img") {
    const wrapper = $('#poll-answers');
    $('.poll-body').addClass('boximg')
    wrapper.removeClass('list');
    Object.keys(poll.answers).forEach((i) => {
      const divItem = $('<div>', { class: 'jquery-poll-answer poll-answer' });
      divItem.attr('data-answerid', i);
      const divImg = $('<div>', { class: 'poll-answer-image' });
      divImg.css('background-image', `url('${poll.answers[i].img}')`);
      const divAnswer = $('<div>', { class: 'poll-answer-label' });
      divAnswer.html(poll.answers[i].text);
      const divButton = $('<div>', { class: 'poll-answer-button' });
      divButton.html('CHOOSE');
      divItem.append(divImg);
      divItem.append(divAnswer);
      divItem.append(divButton);
      //wrapper.append(divItem);
    });

  } else {
    $('.poll-body').removeClass('boximg')
    const wrapper = $('<div>', { id: 'bloc_question' });
    Object.keys(poll.answers).forEach((i) => {
      const divItem = $('<div>', { class: 'jquery-poll-answer poll-answer-list-item' });
      divItem.attr('data-answerid', i);
      const divAnswer = $('<div>', { class: 'poll-answer-list-item-name' });
      divAnswer.html(poll.answers[i]);
      divItem.append(divAnswer);

      wrapper.append(divItem);
    });
    //$('#poll-answers').append(wrapper);
    $('#poll-answers').addClass('list');
  }

  /**
   * [results description]
   * @param  {[type]} answers  [description]
   * @param  {[type]} selected [description]
   * @param  {[type]} result   [description]
   * @return {[type]}          [description]
   *
   * 
   */
  

  let userAnswerVote = null;
  

  return poll.duration;
};
const results = (poll, answers, result = []) => {
    const sum = _.reduce(result.specific, (memo, num) => (memo + num), 0);
    console.log(`sum: ${sum} `, result);

    if(poll.type == "img") {
      const wrapper = $('#poll-answers');
      wrapper.removeClass('list');
      wrapper.empty();

      Object.keys(answers).forEach((i) => {
        const divItem = $('<div>', { class: 'jquery-poll-answer poll-answer ' + (true ? 'selected' : '') });
        divItem.attr('data-answerid', i);
        const divImg = $('<div>', { class: 'poll-answer-image' });
        divImg.css('background-image', `url('${poll.answers[i].img}')`);
        const divAnswer = $('<div>', { class: 'poll-answer-label' });
        divAnswer.html(poll.answers[i].text);
        divItem.append(divImg);
        divItem.append(divAnswer);


        let percentage;
        if(sum == 0) {
            percentage = 0;
        } else {
            percentage = Math.round((result.specific[i] * 100) / sum)
        }
        console.log(percentage);
        const divAnswerPercentContainer = $('<div>', { class: 'poll-answer-percent' });
        const divAnswerPercentBar = $('<div>', { class: 'poll-answer-percent-value' });
        divAnswerPercentBar.css({ width: `${percentage}%` });
        divAnswerPercentContainer.append(divAnswerPercentBar);
        const spanAnswerPercent = $('<span>');
        spanAnswerPercent.html(`${percentage}%`);
        divAnswerPercentContainer.append(spanAnswerPercent);

        divItem.append(divAnswerPercentContainer);
        wrapper.append(divItem);
      });

    } else {
      $('#poll-answers #bloc_answers').empty();
      const wrapper = $('<div>', { id: 'bloc_answers' });
      Object.keys(answers).forEach((i) => {
        const divItem = $('<div>', { class: 'jquery-poll-answer poll-answer-list-item result ' + (true ? 'selected' : '') });
        divItem.attr('data-answerid', i);

        const divAnswer = $('<div>', { class: 'poll-answer-list-item-name' });
        divAnswer.html(poll.answers[i]);
        divItem.append(divAnswer);

        // Calculate percentage per answer
        let percentage;
        if(sum == 0) {
            percentage = 0;
        } else {
            percentage = Math.round((result.specific[i] * 100) / sum)
        }
        console.log(percentage);

        const divAnswerValue = $('<div>', { class: 'poll-answer-list-item-value ' + (true ? 'selected' : '') });
        divAnswerValue.css({ width: `${percentage}%` });
        divItem.append(divAnswerValue);

        const divAnswerPercent = $('<div>', { class: 'poll-answer-list-item-percent' });
        // divAnswerPercent.html('50%');
        divAnswerPercent.html(`${percentage}%`);
        divItem.append(divAnswerPercent);

        wrapper.append(divItem);
      });
      $('#poll-answers').append(wrapper);
      $('#poll-answers').addClass('list');
    }
};

const loopFetchResult = function(resp, key) {
    getVoteData(key)
      .then((result) => {
        console.log('getVoteData result', key, result);
        $('#poll-answers').empty();
        $('#poll-answers #bloc_question').hide();                
        results(resp, resp.answers, result)


        setTimeout(function() {
          //console.log('loopFetch timemoutSET');
          if($('.box.poll').hasClass('opened')) {
            loopFetchResult(resp, key);
          }else {
            //console.log('loopFetch timemoutCanceled', $('.box.poll'));
          }
        }, 3000);
    });
};

/**
 * [setListen description]
 * @param {[type]} arr [description]
 */

$(document).ready(function() {
  /**
   * Listening Muxy ...
   */
  sdk.loaded().then(() => {
    console.log("Muxy loaded");
    let lastPoll;
    setInterval(()=>{
        sdk.getJSONStore('global-global-lastPoll').then(data => {
            console.log("LastPoll is ",lastPoll, "poll fetched is", data.key);
            if(lastPoll != data.key) {
                lastPoll = data.key;
                cleanPoll('.poll', counterStorage);
                if (counterStorage) {
                    counterStorage.abort();
                    counterStorage = null;
                }
                sdk.getJSONStore(data.key).then(resp => {
                    const duration = generatePoll(resp);
                    //setCountdown(duration, '.poll');
                    console.log(resp);
                    getVoteData(data.key).then((result) => {
                        $('#poll-answers').empty();
                        $('#poll-answers #bloc_question').hide();                
                        results(resp, resp.answers, result)
                        loopFetchResult(resp, data.key);
                    })
                })
            }
        });
    }, 500);
})

});
