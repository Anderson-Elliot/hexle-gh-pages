export function Modal(props) {
  function toggle() {
    props.toggle();
  }
  return (
    <div className="modal-outer" onClick={e => toggle()}>
      <div className="modal-inner" onClick={e => e.stopPropagation()}>
        <div className="close-modal" onClick={e => toggle()}>&#10006;</div>
        <h3 className="modal-title">{props.title}</h3>
        {props.content}
      </div>
    </div>
  )
}