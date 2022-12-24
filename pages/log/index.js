import { useEffect, useState, useContext } from "react"
import { GlobalState } from "../_app";
import { 
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Progress
} from '@chakra-ui/react';

export default function Index() {
  const [dataList, setDataList] = useState([])
  const [isProgress, setIsProgress] = useState(true)
  const { staff } = useContext(GlobalState)

  const getData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_URL}?id=${staff.id}`)
    const data = await res.json()
    setDataList(data.data)
    setIsProgress(false)
  }

  useEffect(() => {
    if(staff) getData()
  }, [staff])

  return (
    <>
      {dataList.length !== 0 && (
        <Tabs>
          <TabList>
            {dataList.map((data) => (
              <Tab key={data.month}>{data.month}月</Tab>
            ))}
          </TabList>
          <TabPanels>
            {dataList.map((data) => (
              <TabPanel key={data.month}>
                <TableContainer>
                  <Table variant='simple'>
                    <Thead>
                      <Tr>
                        {data.headers.map((heading, i) => (
                          <Th key={i}>{heading}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.data ? data.data.map((values, i) => (
                        <Tr key={i}>
                          {values.map((val, i) => (
                            <Td key={i}>{val}</Td>
                          ))}
                        </Tr>
                      )) : <Tr><Td>データ無し</Td></Tr>}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}

      {isProgress && (
        <Progress size='xs' isIndeterminate />
      )}
    </>
  )
}