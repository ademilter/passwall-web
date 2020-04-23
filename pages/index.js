import * as React from 'react'
import useSWR from 'swr'
import { message } from 'antd'
import download from 'downloadjs'

import fetch from '../libs/fetch'

import NewForm from '../components/new-form'
import Header from '../components/header'
import PassTable from '../components/table'
import { hasToken } from '../utils'

function HomePage() {
  const [showNewModal, setNewModal] = React.useState(false)
  const [
    isGeneratePasswordLoading,
    setIsGeneratePasswordLoading
  ] = React.useState(false)

  const { data, error, revalidate, isValidating } = useSWR('/logins/', fetch)

  const isLoading = (!error && !data) || isValidating

  const passData = error || !Array.isArray(data) ? [] : data

  React.useEffect(() => {
    if (error && hasToken()) {
      message.error(error.message)
    }
  }, [error])

  const handleLogout = () => {
    localStorage.removeItem('TOKEN')
    Router.replace('/login')
  }

  const handleExport = async () => {
    try {
      const data = await fetch(
        `/logins/export`,
        {
          method: 'POST'
        },
        false
      )

      download(data, 'passwall.csv', 'text/csv')

      message.success('Passwords exported')
      revalidate()
    } catch (e) {
      console.log(e)
      message.error(e.message)
    }
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
      message.error(e.message)
    }
  }

  const onModalClose = React.useCallback(() => {
    setNewModal(false)
  }, [])

  const onModalOpen = React.useCallback(() => {
    setNewModal(true)
  }, [])

  const generatePassword = React.useCallback(async (callback) => {
    setIsGeneratePasswordLoading(true)
    try {
      const password = await fetch('/logins/generate-password', {
        method: 'POST'
      })

      if (password && password.Message) {
        callback(password.Message)
      } else {
        message.error('There was an error creating the password.')
      }
    } catch (error) {
      message.error(error.message)
    }
    setIsGeneratePasswordLoading(false)
  }, [])

  const onCreatePass = React.useCallback(
    async (values, actions) => {
      try {
        await fetch('/logins/', {
          method: 'POST',
          body: JSON.stringify(values)
        })
        setNewModal(false)
        message.success('Password added')
        revalidate()
      } catch (e) {
        message.error(e.message)
      } finally {
        actions.setSubmitting(false)
      }
    },
    [revalidate]
  )

  const onDeletePass = React.useCallback(
    async (id) => {
      try {
        await fetch(`/logins/${id}`, { method: 'DELETE' })
        message.success('Password deleted')
        revalidate()
      } catch (e) {
        message.error(e.message)
      }
    },
    [revalidate]
  )

  return (
    <div className="app">
      <Header
        loading={isLoading}
        onDataRefresh={revalidate}
        onModalOpen={onModalOpen}
        onLogout={handleLogout}
        onExport={handleExport}
        onImport={handleImport}
      />

      <div className="app-table">
        <PassTable
          loading={isLoading}
          onDeletePass={onDeletePass}
          data={passData}
        />
      </div>

      <NewForm
        visible={showNewModal}
        onClose={onModalClose}
        generatePassword={generatePassword}
        onSubmit={onCreatePass}
        isGeneratePasswordLoading={isGeneratePasswordLoading}
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
