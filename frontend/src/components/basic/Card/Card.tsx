import "./Card.css"
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';

type CardProps = {
  type?: "main",
  className?: string,
  style?: any
  children?: any
}

function Card({type = "main", className, style, children}: CardProps) {
  return (
    <Theme className={`${type}Card ${className}`} style={style} preset={presetGpnDefault}>
      {children}
    </Theme>
  )
}

export { Card }