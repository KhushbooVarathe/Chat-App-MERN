// import React, { useEffect } from 'react';
// import Axios from '../axiosInstance/AxiosIndex';

// function Chat() {
//   let config;
//   // Check if userinfo exists in localStorage
// const userInfo = localStorage.getItem('userInfo');

// if (userInfo) {
//   // Extract and parse the data
//   const userInfoObject = JSON.parse(userInfo);

//   // Access the properties of userInfoObject as needed
//   console.log("data from localstorage",userInfoObject.token);
//   config = {
//     headers: {
//       Authorization: `Bearer ${userInfoObject.token}`
//     }
//   };
// } else {
//   console.log('userinfo does not exist in localStorage');
// }


//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await Axios.get('/getalluser',config); // Ensure this matches your backend route
//       console.log(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   return <div>Chat</div>;
// }

// export default Chat;

import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "./miscellaneous/SideBarModal";
import { ChatState } from "../context/ChatProvider";

const Chat = () => {

  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box className="d-flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>

  );
};

export default Chat;