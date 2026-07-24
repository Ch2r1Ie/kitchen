'use client'

import { useState } from 'react'

import { cn } from '@/src/lib/utils'
import { Button } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Switch } from '@/src/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/src/components/ui/table'

const mockUser = {
  name: 'Somchai Jaidee',
  mail: 'somchai@baanbaankitchen.com',
}

type InvoiceRecord = {
  date: string
  total: string
  status: 'paid' | 'refunded'
}

const INVOICES: InvoiceRecord[] = [
  { date: '18 ก.ค. 2569', total: '฿990', status: 'paid' },
  { date: '18 มิ.ย. 2569', total: '฿990', status: 'paid' },
  { date: '18 พ.ค. 2569', total: '฿990', status: 'paid' },
  { date: '15 พ.ค. 2569', total: '฿990', status: 'refunded' },
  { date: '15 เม.ย. 2569', total: '฿490', status: 'paid' },
  { date: '11 เม.ย. 2569', total: '฿490', status: 'refunded' },
  { date: '11 มี.ค. 2569', total: '฿490', status: 'paid' },
  { date: '11 ก.พ. 2569', total: '฿490', status: 'paid' },
]

export default function SubscribePage() {
  const [autoReload, setAutoReload] = useState(false)

  return (
    <div className='px-8 pt-12 pb-15'>
      <div className='mb-1 text-[36px] leading-[1.11] font-normal tracking-[-0.5px]'>
        สมัครสมาชิก
      </div>
      <div className='mb-8 text-base text-muted-foreground'>
        จัดการบัญชีและการชำระเงินของคุณ
      </div>

      <div className='flex flex-col gap-10'>
        {/* Account */}
        <section className='flex flex-col gap-4'>
          <div className='text-lg font-semibold'>บัญชี</div>

          <Card className='gap-0 px-5 py-4.5'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <div className='text-sm font-semibold'>{mockUser.name}</div>
                <div className='text-xs text-muted-foreground'>
                  {mockUser.mail}
                </div>
              </div>
            </div>
          </Card>

          <Card className='flex-row items-center justify-between gap-3 px-5 py-4.5'>
            <div>
              <div className='text-sm font-semibold'>ออกจากระบบทุกอุปกรณ์</div>
              <div className='text-xs text-muted-foreground'>
                ยกเลิกการเข้าสู่ระบบบนอุปกรณ์อื่นทั้งหมด ยกเว้นอุปกรณ์นี้
              </div>
            </div>
            <Button variant='outline'>ออกจากระบบทุกอุปกรณ์</Button>
          </Card>

          <div className='text-xs text-muted-foreground'>
            หากต้องการลบบัญชี กรุณายกเลิกแพ็กเกจ Pro ก่อน
          </div>
        </section>

        {/* Billing */}
        <section className='flex flex-col gap-4'>
          <div className='text-lg font-semibold'>การชำระเงิน</div>

          <Card className='gap-1 px-5 py-4.5'>
            <div className='flex items-center gap-2'>
              <span className='text-base font-semibold'>แพ็กเกจ Pro</span>
              <Badge className='rounded-full bg-primary text-primary-foreground'>
                รายเดือน
              </Badge>
            </div>
            <div className='text-sm text-muted-foreground'>
              แพ็กเกจของคุณจะต่ออายุอัตโนมัติวันที่ 18 ส.ค. 2569
            </div>
          </Card>

          <Card className='gap-1 px-5 py-4.5'>
            <div className='text-[13px] font-bold'>วิธีการชำระเงิน</div>
            <div className='text-sm text-muted-foreground'>
              Mastercard • • • • 7555
            </div>
          </Card>

          <Card className='gap-3 px-5 py-4.5'>
            <div>
              <div className='text-[13px] font-bold'>เครดิตการใช้งาน</div>
              <div className='text-sm text-muted-foreground'>
                ซื้อเครดิตการใช้งานเพิ่มเติมสำหรับทีมของคุณเมื่อถึงขีดจำกัดของแพ็กเกจ
                วงเงินการใช้จ่ายรายเดือนยังคงมีผลตามเดิม
              </div>
            </div>

            <div className='flex items-baseline gap-2'>
              <span className='font-mono text-2xl font-medium'>฿485</span>
              <span className='text-sm text-muted-foreground'>
                ยอดคงเหลือปัจจุบัน
              </span>
            </div>

            <div className='flex items-center justify-between rounded-xl border border-border px-4 py-3'>
              <div>
                <div className='text-sm font-semibold'>เติมเงินอัตโนมัติ</div>
                <div className='text-xs text-muted-foreground'>
                  ซื้อเครดิตเพิ่มอัตโนมัติเมื่อยอดใกล้หมด
                </div>
              </div>
              <Switch checked={autoReload} onCheckedChange={setAutoReload} />
            </div>
          </Card>

          <Card className='gap-0 overflow-hidden px-0 py-0'>
            <div className='px-5 pt-4.5 text-[13px] font-bold'>ใบแจ้งหนี้</div>
            <Table>
              <TableBody>
                {INVOICES.map((inv, idx) => (
                  <TableRow key={idx} className='hover:bg-transparent'>
                    <TableCell className='py-3.5 pl-5 text-sm'>
                      {inv.date}
                    </TableCell>
                    <TableCell className='font-mono text-sm font-medium'>
                      {inv.total}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn(
                          'rounded-full border-transparent font-semibold',
                          inv.status === 'paid'
                            ? 'bg-secondary text-foreground'
                            : 'bg-destructive/10 text-destructive',
                        )}
                      >
                        {inv.status === 'paid' ? 'ชำระแล้ว' : 'คืนเงินแล้ว'}
                      </Badge>
                    </TableCell>
                    <TableCell className='pr-5 text-right'>
                      <Button variant='outline' size='sm'>
                        ดู
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className='flex-row items-center justify-between gap-3 px-5 py-4.5'>
            <div>
              <div className='text-sm font-semibold'>ยกเลิกแพ็กเกจ</div>
              <div className='text-xs text-muted-foreground'>
                ยกเลิกแพ็กเกจ Pro ของคุณ
              </div>
            </div>
            <Button variant='outline' className='text-destructive'>
              ยกเลิกแพ็กเกจ
            </Button>
          </Card>
        </section>
      </div>
    </div>
  )
}
