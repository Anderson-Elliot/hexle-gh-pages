import './App.css';
import win from './assets/Win.wav';
import lose from './assets/Lose.wav';
import guessSound from './assets/Guess.wav';
import resetSound from './assets/Reset.wav';
import muteIco from './assets/mute.png';
import unmuteIco from './assets/volume.png';
import { useEffect, useState } from 'react';
import { Guess } from './components/Guess';
import { Modal } from './components/Modal';

function App() {
  useEffect(() => {
    try {
      /// (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
    catch {}
  }, []);

  const correct = 10;
  const close = 20;

  const guessAudio = new Audio(guessSound);
  const winAudio = new Audio(win);
  const loseAudio = new Audio(lose);
  const resetAudio = new Audio(resetSound);

  const playAudio = (sound) => {
    guessAudio.pause();
    guessAudio.currentTime = 0;
    winAudio.pause();
    winAudio.currentTime = 0;
    loseAudio.pause();
    loseAudio.currentTime = 0;
    guessAudio.pause();
    resetAudio.currentTime = 0;

    if (!mute) {
      switch (sound) {
        case 'reset':
          resetAudio.play();
          break;
        case 'win':
          winAudio.play();
          break;
        case 'lose':
          loseAudio.play();
          break;
        default:
          guessAudio.play();
      }
    }
  }

  const createGuess = (g) => {
    return {
      submitted: false,
      r: g ? g.r : 0,
      g: g ? g.g : 0,
      b: g ? g.b : 0
    }
  };

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const [previewIndex, setPreviewIndex] = useState(() => 0);
  const [modalShown, setModalShown] = useState(() => false);
  const [mute, setMute] = useState(() => false);
  const [guesses, setGuesses] = useState(() => [createGuess()]);
  const [red, setR] = useState(() => randomIntFromInterval(0, 255));
  const [green, setG] = useState(() => randomIntFromInterval(0, 255));
  const [blue, setB] = useState(() => randomIntFromInterval(0, 255));
  const [victory, setVictory] = useState(() => null);
  const [useSliders, setUseSliders] = useState(() => true);
  const [isIos] = useState(() => [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document));

  const colorStyle = {
    backgroundColor: `#${red < 16 ? `0${red.toString(16)}` : red.toString(16)}${green < 16 ? `0${green.toString(16)}` : green.toString(16)}${blue < 16 ? `0${blue.toString(16)}` : blue.toString(16)}`
  }

  const handleGuessChange = (guess, index) => {
    const newGuesses = guesses.map((g, i) => {
      if (index === i) {
        return guess;
      }

      return g;
    });

    setGuesses(newGuesses);
  }

  const guessPasses = (g) => {
    return Math.abs(red - g.r) < correct && Math.abs(green - g.g) < correct && Math.abs(blue - g.b) < correct;
  }

  const handleGuessSubmit = (guess, index) => {
    playAudio('guess');
    const newGuesses = guesses.map((g, i) => {
      if (index === i) {
        return guess;
      }

      return g;
    });

    if (guessPasses(newGuesses[index])) {
      setGuesses(newGuesses);
      setTimeout(() => playAudio('win'), 500);
      setVictory(true);
    } else if (index > 4) { // 6 guesses
      setGuesses(newGuesses);
      setTimeout(() => playAudio('lose'), 500);
      setVictory(false);
    } else {
      setGuesses([...newGuesses, createGuess(guess)]);
    }

    setTimeout(() => {
      // Scroll to bottom of guess container.
      const objDiv = document.getElementById("right-div");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 100);
  }
  const getColorString = (g) => {
    return `#${g.r < 16 ? `0${g.r.toString(16)}` : g.r.toString(16)}${g.g < 16 ? `0${g.g.toString(16)}` : g.g.toString(16)}${g.b < 16 ? `0${g.b.toString(16)}` : g.b.toString(16)}`;
  }

  const reset = () => {
    playAudio('reset');
    setVictory(null);
    setR(randomIntFromInterval(0, 255));
    setG(randomIntFromInterval(0, 255));
    setB(randomIntFromInterval(0, 255));
    setGuesses([createGuess()]);

    setTimeout(() => {
      if (!document.activeElement?.id.includes('ipt'))
        document.getElementById(`ipt-r`)?.focus();
    }, 500);
  }

  const handleSlidersChange = () => {
    setUseSliders(!useSliders);
  };

  useEffect(() => {
    function s(event) {
      if (event.isComposing || event.keyCode === 229) {
        return;
      }

      if ((event.key === 'R' || event.key === 'r') && victory !== null) {
        reset();
      }

      if ((event.key === 'C' || event.key === 'c') && guesses?.length > 1) {
        if (modalShown) {
          toggleModal();
        } else {
          openPreviewModal(victory !== null ? guesses.length - 1 : guesses.length - 2);
        }
      }

      if (event.code === 'Space') {
        handleSlidersChange();
      }
    };

    window.addEventListener('keydown', s);
    return () => window.removeEventListener('keydown', s);
  });

  function toggleModal() {
    setModalShown(!modalShown);
  }

  const openPreviewModal = (i) => {
    setPreviewIndex(i);
    setModalShown(true);
  }
  
  const guessCards = guesses.map((g, i) =>
    <Guess className="guess" key={i} g={g} i={i} aR={red} aG={green} aB={blue} victory={victory}
      close={close} correct={correct} colorString={getColorString(g)} useSliders={useSliders}
      handleGuessChange={handleGuessChange} handleGuessSubmit={handleGuessSubmit} openPreview={openPreviewModal}>
    </Guess>
  );

  // const ads = (<ins className="adsbygoogle"
  //   style={{'display': 'block'}}
  //   data-ad-format="autorelaxed"
  //   data-ad-client="ca-pub-8285742435022214"
  //   data-ad-slot="7617718685"></ins>);

  return (
    <div className={`App ${isIos ? 'ios' : ''}`}>
      <div className="floating-corner">
        <img src={mute ? muteIco : unmuteIco} className={`mute-icon ${mute ? 'active' : ''}`}
          alt="mute" onClick={e => setMute(!mute)} />
        <label className="switch">
          <input type="checkbox" checked={useSliders} onChange={handleSlidersChange} />
          <span className="slider"></span>
        </label>
      </div>
      <div className="left" style={colorStyle}>
        <div className="vertical-container">
          { victory === null && <div className="preview-label">Guess this color</div> }
          { victory === true && <div className="preview-label pulser">You win</div> }
          { victory === false && <div className="preview-label pulser">You lose</div> }
          { victory !== null &&
            <>
            <h5 className="my-0 text-white">{`#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`}</h5>
            <div className="result-container">
              <label className="label r">{red}</label>
              <label className="label g">{green}</label>
              <label className="label b">{blue}</label>
            </div>
            <div className="mini-guess btn reset" onClick={reset}>Reset</div>
            </>
          }
        </div>
        <div className="ad-container">
          {/* {ads} */}
        </div>
      </div>
      <div className="right" id="right-div">
        <div className="right-inner">
          { guessCards }
        </div>
      </div>
      <div className="footer">
        <a href="https://www.flaticon.com/free-icons/mute" title="mute icons">Mute icons created by Pixel perfect - Flaticon</a>
      </div>
      { modalShown && <Modal content={(
        <div className="guess-preview">
          <div className="gp gp-left" style={colorStyle}>Guess this color</div>
          <div className="gp gp-right" style={{ backgroundColor: getColorString(guesses[previewIndex])}}>{previewIndex + 1}</div>
        </div>
      )} title={'Compare'} toggle={toggleModal}></Modal> }
    </div>
  );
}

export default App;
