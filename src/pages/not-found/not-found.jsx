import "./not-found.scss"
import {useEffect} from "react";

export const NotFound = () => {

    useEffect(() => {
        setTimeout(() => {
            window.location.href = '/';
        }, 1000)
    }, []);

    return (
        <div className="not-found">
            <iframe src="https://lottie.host/embed/d971bcdd-22d9-401e-baae-e64277defeea/YQ9mEQIsZI.lottie"></iframe>
            <h3>Страница не найдено </h3>
            <p>Перенаправление ...</p>
        </div>
    );
};

