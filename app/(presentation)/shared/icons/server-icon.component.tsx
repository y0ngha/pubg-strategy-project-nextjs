import { IconProps } from '@/(presentation)/shared/types/icon-props';
import Kakao from '@/(presentation)/shared/icons/kakao.icon';
import Steam from '@/(presentation)/shared/icons/steam.icon';

function ServerIcon({
    width,
    height,
    server,
    kakaoColor = '#FEE500',
}: IconProps & { server: string; kakaoColor: string }) {
    switch (server.toLowerCase()) {
        case 'kakao':
            return <Kakao width={width} height={height} color={kakaoColor} />;
        case 'steam':
            return <Steam width={width} height={height} />;
        default:
            return <></>;
    }
}

ServerIcon.displayName = 'ServerIcon';

export default ServerIcon;
