import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,useDisclosure
} from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const [activeMessageIndex, setActiveMessageIndex] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSetActiveMessageIndex = (index) => {
    setActiveMessageIndex(index === activeMessageIndex ? null : index);
  };

  const handleOptionSelect = (option) => {
    // Implement logic for handling selected option (delete, unread, mute)
    console.log("Selected option:", option);
    onClose(); // Close the menu after selecting an option
  };

  const handleEllipsisClick = (event, index) => {
    console.log('event: ', event);
    event.stopPropagation(); // Prevent message click event from firing
    setActiveMessageIndex(index);
    onOpen();
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id} onClick={() => handleSetActiveMessageIndex(i)}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.picture}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
            {activeMessageIndex === i && (
              <Menu isOpen={isOpen} onClose={onClose}>
                <MenuButton className="mt-2 ml-1" style={{fontSize:"10px"}} onClick={(e) => handleEllipsisClick(e, i)}>
                  <i className="fa fa-ellipsis-v"></i>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleOptionSelect("delete")}>Delete</MenuItem>
                  <MenuItem onClick={() => handleOptionSelect("unread")}>Mark as Unread</MenuItem>
                  <MenuItem onClick={() => handleOptionSelect("mute")}>Mute</MenuItem>
                  <MenuItem onClick={() => handleOptionSelect("copy")}>Copy</MenuItem>
                </MenuList>
              </Menu>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;