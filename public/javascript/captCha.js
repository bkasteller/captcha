var timer;
var timer_total = 30;
var timer_decre = 5;
var timer_min = 10;

var cle;
var num;

function getNeutres() {
  let temp = [];
  for( let i = 1; i <= 13; i++ ) {
    temp.push("chat neutre "+i);
  }
  return temp;
}

function getCaptcha() {
  clearTimeout(timer);
  cle = getCle(leschats);
  setCaptcha(3);
  timer_current = timer_total;
  setTimer(timer_current);
}

function lengthJSON(json) {
  let cnt = 0;
  for (i in json) cnt++;
  return cnt;
}

function getCle(tab) {
  var rand = Math.floor( Math.random() * lengthJSON(tab) );
  var i = 0;
  for (cle in tab) {
    if( i == rand ) {
      return cle;
    }
    i++;
  }
}

function setCaptcha(taille) {
  var cible = $('#bloc-captcha');
  let neutres = getNeutres();

  cible.empty();

  $('#indice').text(leschats[cle]);

  var rand = Math.floor( Math.random() * (taille * taille) ) + 1;
  num = rand;

  for( let i = 1; i <= taille*taille; i++ ) {
    if( i == rand ) {
      cible.append('<input type="checkbox" name="chat'+i+'" id="chat'+i+'" value="'+i+'"><label for="chat'+i+'"><img src="/'+dossierSingulier+cle+'.jpg"></img></label>');
    } else {
      var n = Math.floor( Math.random() * neutres.length );
      cible.append('<input type="checkbox" name="chat'+i+'" id="chat'+i+'" value="'+i+'"><label for="chat'+i+'"><img src="/'+dossierNeutre+neutres[n]+'.jpg"></img></label>');
      neutres.splice(n,1);
    }

    if( i % taille == 0 ) {
      cible.append('<br>');
    }
  }
}

function setTimer(timer_current) {
  if( timer_current < 0 ) {
    alert ('Temps écoulé');
    reduceTimer();
    getCaptcha();
  } else {
    $('#time').text(timer_current);
    drawTimer(timer_current);
    timer = setTimeout(setTimer, 1000, timer_current-1);
  }
}

function reduceTimer() {
  if( timer_total-timer_decre > timer_min ) {
    timer_total -= timer_decre;
  } else {
    timer_total = timer_min;
  }
}

function drawTimer(current) {
  let c = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let height = current * c.height / timer_total;
  let lineaire2 = ctx.createLinearGradient(0, 0, 0, 125);
  lineaire2.addColorStop(0,'yellow');
  lineaire2.addColorStop(0.75,'orange');
  lineaire2.addColorStop(1, 'red');

  ctx.clearRect(0, 0, c.width, c.height)
  ctx.fillStyle = lineaire2;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = 'cyan';
  ctx.fillRect(0, 0, c.width, c.height - height);
}

function reload() {
  reduceTimer();
  getCaptcha();
}

function verif() {
  let value = "";
  $( "input:checked" ).each(function( index ) {
    value += ""+this.value;
  });
  if( num != value ) {
    alert ('Le captcha est faux');
    reduceTimer();
    getCaptcha();
  } else {
    clearTimeout(timer);
    timer_total = 30;
    alert ('Le captcha est ok');
  }
}
