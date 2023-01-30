import { useEffect } from 'react';

export function Guess(props) {
  const g = props.g;
  const i = props.i;
  const close = props.close;
  const correct = props.correct;

  useEffect(() => {
    function s(event) {
      if (event.code === 'Enter' && !g.submitted)
        handleGuess();
    };

    window.addEventListener('keydown', s);
    return () => window.removeEventListener('keydown', s);
  });

  useEffect(() => {
    if (!props.submitted) {
      document.getElementById(`ipt-r`)?.focus();
    }
    return () => {};
  }, [props.submitted]);

  const handleValueChange = (name, e) => {
    let value = e.target.value;
    if (value.length > 1 && value[0] === '0') {
      value = value.slice(1);
      e.target.value = value;
    }
    let intValue = parseInt(value) || 0;
    if (intValue < 0) {
      intValue = 0;
      e.target.value = '0';
    } else if (intValue > 255) {
      intValue = 255;
      e.target.value = '255';
    }
    const newG = {
      ...g,
      [name]: intValue
    };
    props.handleGuessChange(newG, i);
  }
  
  const bump = (name, direction, step) => {
    const oldVal = g[name];
    const value = direction === 'up' ? oldVal + step : oldVal - step;
    handleValueChange(name, { target: { value }})
  }

  const handleGuess = () => {
    const newG = {
      ...g,
      submitted: true
    }

    props.handleGuessSubmit(newG, i);
  }

  return (
    <div className="guess">
      <div className="guess-container">
        { !g.submitted &&
          <div className={ `values ${props.useSliders ? 'sliders' : 'inputs'}` }>
            <span className="slider-wrapper">
              <label className={`label ${!props.useSliders ? '' : 'unsubmitted'} r`}>R</label>
              { props.useSliders && <span className="bump down prevent-select" onClick={() => bump('r', 'down', 5)}>{ '<' }</span> }
              <input id={`ipt-r`} step="5" className={`num ${props.useSliders ? 'sliders': ''} r`}
                type={ props.useSliders ? 'range' : 'number' } min={0} max={255} name="r"
                value={g.r} onChange={event => handleValueChange('r', event)} />
              { props.useSliders && <span className="bump up prevent-select" onClick={() => bump('r', 'up', 5)}>{ '>' }</span> }
            </span>
            <span className="slider-wrapper">
              <label className={`label ${!props.useSliders ? '' : 'unsubmitted'} g`}>G</label>
              { props.useSliders && <span className="bump down prevent-select" onClick={() => bump('g', 'down', 5)}>{ '<' }</span> }
              <input id={`ipt-g`} step="5" className={`num ${props.useSliders ? 'sliders': ''} g`}
                type={ props.useSliders ? 'range' : 'number' } min={0} max={255} name="g"
                value={g.g} onChange={event => handleValueChange('g', event)} />
              { props.useSliders && <span className="bump up prevent-select" onClick={() => bump('g', 'up', 5)}>{ '>' }</span> }
            </span>
            <span className="slider-wrapper">
              <label className={`label ${!props.useSliders ? '' : 'unsubmitted'} b`}>B</label>
              { props.useSliders && <span className="bump down prevent-select" onClick={() => bump('b', 'down', 5)}>{ '<' }</span> }
              <input id={`ipt-b`} step="5" className={`num ${props.useSliders ? 'sliders': ''} b`}
                type={ props.useSliders ? 'range' : 'number' } min={0} max={255} name="b"
                value={g.b} onChange={event => handleValueChange('b', event)} />
              { props.useSliders && <span className="bump up prevent-select" onClick={() => bump('b', 'up', 5)}>{ '>' }</span> }
            </span>
          </div>
        }

        { g.submitted && !props.useSliders &&
          <>
          <div className="values inputs">
            <span>
              <input className={`num r ${Math.abs(props.aR - g.r) < correct ? 'correct' : ''} ${Math.abs(props.aR - g.r) < close ? 'close' : ''}`}
                type="number" name="r"
                value={g.r} disabled />
            </span>
            <span>
              <input className={`num g ${Math.abs(props.aG - g.g) < correct ? 'correct' : ''} ${Math.abs(props.aG - g.g) < close ? 'close' : ''}`}
                type="number" name="g"
                value={g.g} disabled />
            </span>
            <span>
              <input className={`num b ${Math.abs(props.aB - g.b) < correct ? 'correct' : ''} ${Math.abs(props.aB - g.b) < close ? 'close' : ''}`}
                type="number"  name="b"
                value={g.b} disabled />
            </span>
          </div>

          <div className="guess-right">
            <div className={`mini-guess ${props.victory !== null ? 'active' : ''} expand-hover`}
              style={{backgroundColor: props.colorString, cursor: 'pointer' }}
              onClick={e => props.openPreview(props.i)}><span>{ props.i + 1 }</span></div>
          </div>
          </>
        }

        { g.submitted && props.useSliders &&
          <>
          <div className={ `values ${props.useSliders ? 'sliders' : 'inputs'}` }>
            <span className="slider-wrapper">
              <label className="label sliders r">R</label>
              <span className="bump down prevent-select disabled">{ '<' }</span>
              <input className={`num submitted ${props.useSliders ? 'sliders': ''} r ${Math.abs(props.aR - g.r) < correct ? 'correct' : ''} ${Math.abs(props.aR - g.r) < close ? 'close' : ''}`} disabled
                type={ props.useSliders ? 'range' : 'number' } min={0} max={255} name="r"
                value={g.r} />
              <span className="bump up prevent-select disabled">{ '>' }</span>
            </span>
            <span className="slider-wrapper">
              <label className="label sliders g">G</label>
              <span className="bump down prevent-select disabled">{ '<' }</span>
              <input className={`num submitted g ${props.useSliders ? 'sliders': ''} ${Math.abs(props.aG - g.g) < correct ? 'correct' : ''} ${Math.abs(props.aG - g.g) < close ? 'close' : ''}`} disabled
                type={ props.useSliders ? 'range' : 'number' } min={0} max={255} name="g"
                value={g.g} />
              <span className="bump up prevent-select disabled">{ '>' }</span>
            </span>
            <span className="slider-wrapper">
              <label className="label sliders b">B</label>
              <span className="bump down prevent-select disabled">{ '<' }</span>
              <input className={`num submitted b ${props.useSliders ? 'sliders': ''} ${Math.abs(props.aB - g.b) < correct ? 'correct' : ''} ${Math.abs(props.aB - g.b) < close ? 'close' : ''}`} disabled
                type={ props.useSliders ? 'range' : 'number' } min={0} max={255} name="b"
                value={g.b} />
              <span className="bump up prevent-select disabled">{ '>' }</span>
            </span>
          </div>
          <div className="guess-right">
            <div className={`mini-guess ${props.victory !== null ? 'active' : ''} expand-hover`}
              style={{backgroundColor: props.colorString, cursor: 'pointer' }}
              onClick={e => props.openPreview(props.i)}><span>{ props.i + 1 }</span></div>
          </div>
          </>
        }

        { !g.submitted &&
          <div className="guess-right">
            <div className="mini-guess btn active" onClick={event => handleGuess()}>{ props.i === 5  ? 'Last Guess' : 'Guess' }</div>
          </div> }
      </div>
    </div>
  )
}