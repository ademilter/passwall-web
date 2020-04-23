import * as React from 'react'
import useSWR from 'swr'
import { message } from 'antd'

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

  const [isUpdateLoading, setIsUpdateLoading] = React.useState(false)
  const [isCreateLoading, setIsCreateLoading] = React.useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false)

  const passData = error || !Array.isArray(data) ? [] : data

  React.useEffect(() => {
    if (error && hasToken()) {
      message.error(error.message)
    }
  }, [error])

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
      setIsCreateLoading(true)
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
        setIsCreateLoading(false)
        actions.setSubmitting(false)
      }
    },
    [revalidate]
  )

  const onDeletePass = React.useCallback(
    async (id) => {
      setIsDeleteLoading(true)
      try {
        await fetch(`/logins/${id}`, { method: 'DELETE' })
        message.success('Password deleted')
        revalidate()
      } catch (e) {
        message.error(e.message)
      }
      setIsDeleteLoading(false)
    },
    [revalidate]
  )

  const onUpdatePass = React.useCallback(
    async (id, values, callback) => {
      setIsUpdateLoading(true)
      try {
        await fetch(`/logins/${id}`, {
          method: 'PUT',
          body: JSON.stringify(values)
        })
        message.success('Password updated')
        revalidate()
      } catch (e) {
        message.error(e.message)
      } finally {
        setIsUpdateLoading(false)
        callback()
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
      />

      <div className="app-table">
        <PassTable
          isUpdateLoading={isUpdateLoading}
          isDeleteLoading={isDeleteLoading}
          loading={isLoading}
          onDeletePass={onDeletePass}
          onUpdatePass={onUpdatePass}
          data={passData}
        />
      </div>

      <NewForm
        visible={showNewModal}
        loading={isCreateLoading}
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
