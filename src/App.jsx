import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [searchItem, setSearchItem] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputValue = useRef('value')

  const baseUrl = "https://dummyjson.com/users/";

  const handleSearchQuery = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchItem(value);
  };

  const searchUsers = (query) => {
    if (query.trim() == "") return;

    setIsLoading(true)
    fetch(`${baseUrl}/search?q=${query}`)
      .then((res) => res.json())
      .then((res) => {
        //console.log(res.users);
        setIsLoading(false)
        setSearchedUsers(res.users);
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
      });
  };


  const handleSelectedUser = (e, user) => {
    e.preventDefault();
    const alreadyAvailableUser = selectedUsers.length > 0 && selectedUsers.some((selectedUser)=> selectedUser.id === user.id)

    if(alreadyAvailableUser) return;

    setSelectedUsers([...selectedUsers, user]);
   
    inputValue.current.focus()
    setSearchItem("")

  };

  const handleRemove =(e, user)=>{
    
    e.preventDefault()
    const remainingUsers = selectedUsers.filter((selectedUser)=> selectedUser.id != user.id)
    setSelectedUsers(remainingUsers)
    inputValue.current.focus()

  }

  const handleKeyDown =(e)=>{
    if(  selectedUsers.length > 0 && searchItem.trim() == "" && e.key === "Backspace"){
      const remainingUsers = selectedUsers.slice(0, selectedUsers.length - 1);
      setSelectedUsers(remainingUsers)
      
    }
  }

  useEffect(() => {
    searchUsers(searchItem);
  }, [searchItem]);

  const inputContainerStyle = {
    margin: "0px 20px",
    backgroundColor: "#ccc",
    borderRadius: "50px",
    display: "flex",
    padding: "10px 20px",
    alignItems: "center",
    gap: 4,
    position: "relative",
  };

  const inputStyle = {
    backgroundColor: "#ccc",
    border: "0px",
    outline: "0px",
    padding: "5px 0px",
    fontSize: "medium",
  };


  return (
    <div className="input-container" style={inputContainerStyle}>
      <div className="selected-user-container">
        {selectedUsers.length > 0 && selectedUsers.map((user, idx) => <span key={idx}>{user.firstName} {user.lastName} <span onClick={e=>handleRemove(e, user)}>X</span></span>)}
      </div>
      <input
        ref={inputValue}
        type="text"
        className="input"
        placeholder="Search for a user"
        style={inputStyle}
        value={searchItem}
        onChange={(e) => handleSearchQuery(e)}
        onKeyDown={e=>handleKeyDown(e)}
      />
      {searchedUsers.length > 0 && (
       
        <ul className="user-list" >
          {searchedUsers?.map((user, idx) => {
            return (
              <li key={idx} onClick={(e) => handleSelectedUser(e, user)} >
                <img src={user.image} />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {isLoading && 
      <div className="loading">
        <p>Loading...</p>
      </div>
      }
    </div>
  );
}

export default App;
