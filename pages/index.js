import * as React from 'react'
import useSWR from 'swr'
import { message } from 'antd'

import fetch from '../libs/fetch'

import NewForm from '../components/new-form'
import Header from '../components/header'
import PassTable from '../components/table'

function HomePage() {
  const [showNewModal, setNewModal] = React.useState(false)

  const { data: passData, error, isValidating, revalidate } = useSWR(
    '/logins/',
    fetch,
    {
      initialData: []
    }
  )

  React.useEffect(() => {
    if (!error) return
    message.error(error)
  }, [error])

  const onModalClose = () => {
    setNewModal(false)
  }

  const onModalOpen = () => {
    setNewModal(true)
  }

  const onCreatePass = async (values, actions) => {
    try {
      await fetch('/logins/', { method: 'POST', body: JSON.stringify(values) })
      setNewModal(false)
      message.success('Password added')
      revalidate()
    } catch (e) {
      console.log(e)
      message.error(e.message)
    } finally {
      actions.setSubmitting(false)
    }
  }

  const onDeletePass = async (id) => {
    try {
      await fetch(`/logins/${id}`, { method: 'DELETE' })
      message.success('Password deleted')
      revalidate()
    } catch (e) {
      console.log(e)
      message.error(e.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('TOKEN')
    Router.replace('/login')
  }

  const handleImport = async (file) => {
    try {
      const form = new FormData()
      form.append('File', file, 'passwords.csv')
      form.append('URL', 'URL')
      form.append('Username', 'Username')
      form.append('Password', 'Password')

      await fetch(`/logins/import`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('TOKEN')
        },
        body: form
      })

      message.success('Import successfully')
      revalidate()
    } catch (e) {
      console.log(e)
    }
  }

  const handleExport = async () => {
    try {
      const data = await fetch(`/logins/export`, { method: 'POST' }, false)
      const content = await data.text()
      download(content, 'passwall.csv', 'text/csv')
      message.success('Passwords exported')
      revalidate()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="app">
      <Header
        loading={isValidating}
        onDataRefresh={revalidate}
        onModalOpen={onModalOpen}
        onLogout={handleLogout}
        onImport={handleImport}
        onExport={handleExport}
      />

      <div className="app-table">
        <PassTable
          loading={isValidating}
          onDeletePass={onDeletePass}
          data={passData}
        />
      </div>

      <NewForm
        visible={showNewModal}
        onClose={onModalClose}
        onSubmit={onCreatePass}
      />

      <style jsx>{`
        .app {
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        .app-table {
          margin-top: 20px;
        }
      `}</style>
    </div>
  )
}

export default HomePage
