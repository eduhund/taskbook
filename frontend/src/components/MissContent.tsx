import { Informer } from '@consta/uikit/Informer';

export default function MissContent() {
    return <Informer 
        label="Мы потеряли кусок контента. Он точно должен быть здесь." 
        view="bordered" 
        status="warning"
        size="s"
    />
}