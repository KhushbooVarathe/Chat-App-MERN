import React, { useEffect, useState } from 'react'
import { useToast } from "@chakra-ui/toast";
import { ChatState } from '../context/ChatProvider';
import Axios from '../axiosInstance/AxiosIndex';
import { Box, Stack, Text } from "@chakra-ui/layout";
import ChatLoading from './ChatLoading';
import { Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  const { selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats
  } = ChatState()

  // console.log('user:fetchuserssss ', user);
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats()

  }, [fetchAgain])
  const fetchChats = async () => {
    try {

      Axios.get('/fetchchats', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      }).then(res => {
        // console.log('res: ', res.data);
        setChats(res.data)
        // Handle response data here
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"

        justifyContent="space-between"
        alignItems="center"
      >
        My Chats

        <GroupChatModal>
          <Button
            d="flex"
            ml="10%"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>

  )
}
export default MyChats
