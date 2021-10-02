import classes from "./FindedUser.module.css";

function FindedUser(props) {
  function addUser() {
    props.onAddUser({
      name: props.name,
      key: props.userKey,
      email: props.email,
    });
  }

  function sendRecommend() {
    props.onSendRecommend(props.userKey);
  }

  function deleteHandler() {
    props.onDelete(props.userKey);
  }

  return (
    <div className={classes["user-table"]}>
      <div>
        <p>name: {props.name}</p>
        <p>email: {props.email}</p>
      </div>
      <div className={classes.buttons}>
        {props.onAddUser && <button onClick={addUser}>Add</button>}
        {props.onSendRecommend && (
          <button onClick={sendRecommend}>Send show</button>
        )}
        {props.onDelete && <button onClick={deleteHandler}>Delete</button>}
      </div>
    </div>
  );
}

export default FindedUser;
