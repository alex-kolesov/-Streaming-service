import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { userInfoActions } from "../../data/user-info";
import { sendRecommendedFilms } from "../../data/auth";
import { addFriend } from "../../data/auth";
import FindedUser from "./FindedUser";
import FilmRecommendations from "./filmRecommendations/FilmsRecommendations";
import FindIcon from "../../icons/FindIcon";

import classes from "./userAccount.module.css";
import RecommendedFilms from "./RecommendedFilms";

function UserAccount() {
  const dispatch = useDispatch();
  const userKey = useSelector((state) => state.userInfo.userKey);
  const userFriends = useSelector((state) => state.userInfo.friendsList);
  const userRecommend = useSelector((state) => state.userInfo.recommendedFilms);

  const [isSearch, setIsSeach] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDeletingFriend, setIsDeletingFriend] = useState(false);
  const [users, setUsers] = useState([]);

  const [friendKey, setFriendKey] = useState("");

  function searchHandler() {
    setIsSeach((last) => !last);
  }

  function addUserHadnler(data) {
    setIsAdding(true);
    dispatch(userInfoActions.addFriend(data));
  }

  function sendRecommendedFilmHandler(key) {
    setIsSending(true);
    setFriendKey(key);
  }

  function backHandler() {
    setIsSending(false);
  }

  function sendHandler(data) {
    dispatch(sendRecommendedFilms(data, friendKey));
    setIsSending(false);
  }

  function deleteFriendHandler(userKey) {
    dispatch(userInfoActions.deleteFriend(userKey));
    setFriendKey(userKey);
    setIsDeletingFriend(true);
  }

  useEffect(() => {
    dispatch(addFriend(userFriends, userKey));
    setIsDeletingFriend(false);
  }, [isDeletingFriend, dispatch, userFriends, userKey]);

  useEffect(() => {
    if (isAdding) {
      dispatch(addFriend(userFriends, userKey));
      setIsAdding(false);
    }
  }, [isAdding, dispatch, userFriends, userKey]);

  useEffect(() => {
    const getData = async () => {
      const fetchData = async () => {
        const response = await fetch(
          "https://streaming-service-93241-default-rtdb.firebaseio.com/users.json"
        );
        const data = await response.json();
        return data;
      };

      const data = await fetchData();

      const users = [];

      for (let key in data) {
        if (
          userKey !== key &&
          userFriends.filter((friend) => friend.key === key).length === 0
        ) {
          users.push({
            key: key,
            name: data[key].name,
            email: data[key].email,
          });
        }
      }
      setUsers(users);
    };
    getData();
  }, [userKey, userFriends]);

  return (
    <div className={classes["account-table"]}>
      {isSending && (
        <FilmRecommendations onBack={backHandler} onSend={sendHandler} />
      )}
      <div className={classes["content-table"]}>
        <h2>User Account</h2>
        <div className={classes.lists}>
          <p className={classes.label}>My list of friends:</p>
          <ul className={classes.tables}>
            {userFriends?.length > 0 ? (
              userFriends.map((friend, id) => (
                <FindedUser
                  key={id}
                  name={friend.name}
                  email={friend.email}
                  userKey={friend.key}
                  onSendRecommend={sendRecommendedFilmHandler}
                  onDelete={deleteFriendHandler}
                ></FindedUser>
              ))
            ) : (
              <li className={classes.noRecommend}>You don't have friends</li>
            )}
          </ul>
        </div>
        <div className={classes.lists}>
          <div className={classes["seatch-table"]}>
            <p>Search for a new friends</p>
            <button onClick={searchHandler} className={classes.findIcon}>
              <FindIcon />
            </button>
          </div>
          {isSearch && (
            <div>
              <p className={classes.label}>Posible users:</p>
              <ul className={classes.tables}>
                {users.length > 0 ? (
                  users.map((user, i) => (
                    <FindedUser
                      key={i}
                      userKey={user.key}
                      name={user.name}
                      email={user.email}
                      onAddUser={addUserHadnler}
                    />
                  ))
                ) : (
                  <li className={classes.noRecommend}>
                    We can't find more users
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        <h3>My recommendations</h3>
        <div className={classes.recommendations}>
          {userRecommend?.length > 0 ? (
            <RecommendedFilms />
          ) : (
            <div className={classes.noRecommend}>
              You don't have any recommendations
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserAccount;
