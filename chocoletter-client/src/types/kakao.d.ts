declare namespace Kakao {
    function init(appKey: string): void;
    function isInitialized(): boolean;
    
    const Share: {
        sendDefault(options: Kakao.ShareOptions): void;
        createDefaultButton(options: Kakao.ShareButtonOptions): void;
    };
  
    interface ShareOptions {
        objectType: "feed" | "list" | "commerce" | "location" | "text";
        content: ShareContent;
        social?: ShareSocial;
        buttons?: ShareButton[];
    }
  
    interface ShareContent {
        title: string;
        description: string;
        imageUrl: string;
        link: ShareLink;
    }
  
    interface ShareLink {
        mobileWebUrl: string;
        webUrl: string;
    }
  
    interface ShareSocial {
        likeCount?: number;
        commentCount?: number;
        sharedCount?: number;
    }
  
    interface ShareButton {
        title: string;
        link: ShareLink;
    }
  
    interface ShareButtonOptions {
        container: string;
        objectType: "feed" | "list" | "commerce" | "location" | "text";
        content: ShareContent;
        social?: ShareSocial;
        buttons?: ShareButton[];
    }
}

// interface Window {
//     Kakao: typeof Kakao;
// }
