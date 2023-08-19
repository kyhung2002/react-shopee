import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
interface Props {
  children?: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
