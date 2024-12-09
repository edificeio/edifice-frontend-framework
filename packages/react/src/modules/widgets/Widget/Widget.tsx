import { type ReactNode } from 'react';

const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="widget-footer">
      <div className="widget-footer-action">
        <a href="/welcome" className="link">
          {children}
        </a>
      </div>
    </div>
  );
};

const Header = ({ children }: { children: string }) => {
  return (
    <div className="widget-header">
      <div className="subtitle">{children}</div>
      <div className="widget-options">
        <div className="widget-handle">
          <i className="fas fa-grip-vertical"></i>
        </div>
      </div>
    </div>
  );
};

const Body = ({ children }: { children: ReactNode }) => {
  return <div className="widget-body p-12 d-flex flex-wrap">{children}</div>;
};

export default function Widget({ children }: { children: ReactNode }) {
  return <div className="widget">{children}</div>;
}

Widget.Header = Header;
Widget.Body = Body;
Widget.Footer = Footer;

Widget.displayName = 'Widget';
