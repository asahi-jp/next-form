import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [workLog, setWorkLog] = useState([])
  const [staff, setStaff] = useState({})
  const [month, setMonth] = useState("")
  
  const fetchWorkData = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GAS_URL}?staffId=${id}`)
    const data = await res.json()
    setWorkLog(data.data)
  }

  useEffect(() => {
    // 認証処理
    // スタッフが存在するか確認
    const staffId = sessionStorage.getItem("staffId")
    if(staffId) {
      setStaff({
        staffId: staffId,
        staffName: sessionStorage.getItem("staffName"),
      })
      fetchWorkData(staffId)
    } else {
      router.push("/")
    }

    const date = new Date()
    setMonth(date.getMonth() + 1)
    
  }, [])
  
  return (
    <div className='max-w-sm mx-auto p-5'>
      <h1 className='text-2xl font-bold text-center'>勤怠履歴</h1>
      <p>{staff.staffName}さん</p>
      <div className='mt-5'>
        <Link href="/form"><a>← フォーム入力に戻る</a></Link>
      </div>
      <p>{month}月分</p>
      <table className='mt-5'>
        <thead>
          <tr>
            <th>勤務形態</th>
            <th>作業日</th>
            <th>レッスン</th>
          </tr>
        </thead>
        <tbody>
          {workLog.length ? workLog.map((log, i) => (
            <tr key={i}>
              <td className='border'>{log[1]}</td>
              <td className='border'>{log[2]}</td>
              <td className='border'>{log[3]}</td>
            </tr>
          )) : null}
        </tbody>
      </table>
    </div>
  )
}


