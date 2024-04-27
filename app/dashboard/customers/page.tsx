import Search from '@/app/ui/search'

export default function CustomersPage() {
    return (<div className="flex justify-center item-center flex-col md:flex-row md:overflow-hidden">
    <div className="w-full md:w-1/2 mt-10">
      <Search placeholder={'Buscar lo que sea'}/>
  </div>
  </div>
    )
}