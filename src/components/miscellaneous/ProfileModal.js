// import React from 'react'
// import {
//     Modal,Button,
//     ModalOverlay,
//     ModalContent,
//     ModalHeader,
//     ModalFooter,
//     ModalBody,
//     ModalCloseButton,
//     useDisclosure,
//     IconButton,
//   } from '@chakra-ui/react'
// import { ViewIcon } from '@chakra-ui/icons'
// const ProfileModal = ({user,children}) => {
    
//     const { isOpen, onOpen, onClose } = useDisclosure()
//   return (
//     <>
// {children ?(  <span onClick={onOpen}>{children}</span>):(<IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
//      )}


//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>{user.name}</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//            hreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
//           </ModalBody>

//           <ModalFooter>
//             <Button colorScheme='blue' mr={3} onClick={onClose}>
//               Close
//             </Button>
//             {/* <Button variant='ghost'>Secondary Action</Button> */}
//           </ModalFooter>
//         </ModalContent>
//       </Modal> 
//     </>
//   )
// }

// export default ProfileModal







import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({user,children}) => {
  console.log('user: in profile', user,children);
    // console.log('children: ', children,user);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
           className="text-center d-flex"
          
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="100px"
              src={user.picture}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
               </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;