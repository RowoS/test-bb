export interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {}

export interface CreateAccountFormProps extends React.ComponentPropsWithoutRef<"div"> {}

export type OAuthCallbackResult =
  | {
      type: 'redirect'
      url: string
    }
  | {
      type: 'error'
      fallback: string
    }
