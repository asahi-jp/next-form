import { useEffect, useContext } from "react"
import { GlobalState } from "../pages/_app"
import { 
  Button, 
  ModalCloseButton,
  ModalFooter, 
  Modal, 
  ModalBody, 
  ModalHeader,
  ModalOverlay, 
  ModalContent,
} from "@chakra-ui/react"

export default function ModalComponent({data}) {
  const { isOpen, onOpen, onClose } = useContext(GlobalState)

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>確認</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <table>
              <thead></thead>
              <tbody>
                {Object.keys(data).map((key) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{data[`${key}`]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              戻る
            </Button>
            <Button colorScheme='blue'>
              送信
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}