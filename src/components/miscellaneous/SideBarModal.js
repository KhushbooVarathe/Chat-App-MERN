import {
  Avatar,
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useToast
} from '@chakra-ui/react'
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import UserListItem from '../userAvatar/UserListItem'
import { useDisclosure } from '@chakra-ui/hooks'
import {
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react'
import Axios from '../../axiosInstance/AxiosIndex'
import ChatLoading from '../ChatLoading'
import { getSender } from '../../config/ChatLogics'
function SideDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  // console.log('searchResult: ', searchResult)
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats
  } = ChatState()
  // console.log('chats:sidenaveBar ', chats);
  const navigate = useNavigate()

  function logoutHandler() {
    // console.log('user logout function')
    try {
      localStorage.removeItem('userInfo')
      setSelectedChat()
      navigate('/')
    } catch (error) {
      // console.error('Error occurred while logging out:', error)
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }
  function accessChat(userId) {
    try {
      setLoadingChat(true);
      Axios.post('/accesschat', { userId }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      }).then(res => {
        if (!chats.find((c) => c._id === res.data._id)) setChats([res.data, ...chats]);
        setSelectedChat(res.data)
        setLoadingChat(false)
      });
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }
  function handleSearch() {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      })
      return
    }
    try {
      setLoading(true)
      Axios.get(`/getalluser?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
        .then(res => {
          // console.log('response: ', res.data)

          setSearchResult(res.data)
          setLoading(false)
        })
        .catch(error => {
          // console.log('error: ', error.response)
          if (error.response.status == 404) {
            toast({
              title: 'Error Occured!',
              description: `${error.response.data}`,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'top-left'
            })
          } else {
            toast({
              title: 'Error Occured!',
              description: 'Failed to Load the Search Results',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'bottom-left'
            })
          }
        })
    } catch (error) {
      toast({
        title: 'Internal server Error',
        description: 'Failed to Load ',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      })
    }
  }

  return (
    <>
      <Box
        className='d-flex'
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen}>
            <i className='fas fa-search'></i>
            <Text className='mt-3' px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text className='text-info mt-3' fontSize='2xl' fontFamily='Work sans'>
          @WeChat@
        </Text>

        <Menu>
          <MenuButton p={1}>
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <BellIcon fontSize='2xl' m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "no new messages"}
            {notification?.map((notific) => (
              <MenuItem key={notific._id} onClick={() => {
                setSelectedChat(notific.chat)
                setNotification(notification.filter(n => n !== notific))
              }}>
                {notific.chat.isGroupChat ? `New message in ${notification.chat.chatName}` : `New message from ${getSender(user, notific.chat.users)}`}</MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} bg='white' rightIcon={<ChevronDownIcon />}>
            <Avatar
              size='sm'
              cursor='pointer'
              //  name='kV'
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>{' '}
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <Box className='d-flex p-2'>
            <Input
              placeholder='Search Users'
              className='mr-1'
              onChange={e => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult && searchResult.length > 0 ? (
              searchResult.map(obj => (
                <UserListItem
                  key={obj._id}
                  user={obj}
                  handleFunction={() => accessChat(obj._id)}
                />
              ))
            ) : (
              <Box
                cursor="pointer"
                bg="#E8E8E8"
                // _hover={{
                //   background: "#38B2AC",
                //   color: "white",
                // }}
                w="100%"
                d="flex"
                alignItems="center"
                color="black"
                px={3}
                py={2}
                mb={2}
                borderRadius="lg"
              >
              </Box>
            )
          )}
          {loadingChat && <Spinner ml="auto" d="flex" />}
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer

