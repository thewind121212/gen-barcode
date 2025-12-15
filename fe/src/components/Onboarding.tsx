import Onboarding from '@Jade/components/onboarding/index';
import { useSelector } from 'react-redux';
import type { RootState } from '@Jade/store/global.store';
import { useNavigate } from 'react-router-dom';



export default function OnboardingComponent() {
    const navigate = useNavigate();
    const isStoreId = useSelector((state: RootState) => state.app.storeId);

    if (isStoreId) {
        navigate('/', {replace: true});
    }

    return (
        <Onboarding />
    );
}