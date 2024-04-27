import Skeletons from '@/app/ui/skeletons'

export default function InvoicesPage() {
    return (
        <div className="flex justify-center item-center flex-col md:flex-row md:overflow-hidden">
      <div className="w-full md:w-1/2 mt-10">
        <Skeletons/>
    </div>
    </div>
    )
}