/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useRef } from "react";

import { Image, useBrowserInfo } from "@edifice-ui/react";
import { NodeViewWrapper } from "@tiptap/react";
import { odeServices } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import { MediaResizeProps, useResizeMedia } from "../../hooks";

const MediaRenderer = (props: MediaResizeProps) => {
  const { node } = props;

  const { t } = useTranslation();

  const { browser, device } = useBrowserInfo(navigator.userAgent);

  const resizableMedia = useRef<HTMLImageElement | HTMLVideoElement>(null);

  const { startVerticalResize, stopVerticalResize, isVerticalResizeActive } =
    useResizeMedia(props, resizableMedia);

  const alignContent = (textalign: string) => {
    switch (textalign) {
      case "center":
      case "justify":
        return {
          marginLeft: "auto",
          marginRight: "auto",
          width: "fit-content",
        };
      case "left":
        return { marginRight: "auto", width: "fit-content" };
      case "right":
        return { marginLeft: "auto", width: "fit-content" };
      default:
        return {};
    }
  };

  const onVideoPlay = () => {
    if (resizableMedia.current instanceof HTMLVideoElement) {
      const videoElement: HTMLVideoElement = resizableMedia.current;
      const videoId = videoElement.dataset.documentId;
      const isCaptation =
        (videoElement.dataset.documentIsCaptation || "false") == "true";

      videoId &&
        odeServices
          .data()
          .trackVideoRead(
            videoId,
            isCaptation,
            window.location.hostname,
            `${browser.name} ${browser.version}`,
            device.type,
          );
    }
  };

  // Set up some event listeners, once.
  useEffect(() => {
    if (!resizableMedia.current) return;
    const element = resizableMedia.current;

    // Track play event on HTMLVideoElement
    element.addEventListener("play", onVideoPlay);
    return () => {
      element.removeEventListener("play", onVideoPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NodeViewWrapper style={alignContent(node.attrs.textAlign)}>
      <div className="media-node-view">
        <div data-drag-handle>
          {node.type.name === "custom-image" ? (
            <>
              <Image
                src={node.attrs.src}
                alt={node.attrs.alt}
                title={node.attrs.title}
                width={node.attrs.width}
                style={node.attrs.style}
                height={node.attrs.height}
                className={`custom-image`}
                ref={resizableMedia as React.RefObject<HTMLImageElement>}
              />
              {node.attrs.title && (
                // Display legend (set in title attribute) if it exists
                <em className="custom-image-legend caption text-align-left">
                  {node.attrs.title}
                </em>
              )}
            </>
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              ref={resizableMedia as React.RefObject<HTMLVideoElement>}
              controls={node.attrs.controls === "true"}
              src={node.attrs.src}
              width={node.attrs.width}
              height={node.attrs.height}
              data-video-resolution={`${node.attrs.width}x${node.attrs.height}`}
              data-document-id={node.attrs.documentId}
              data-document-is-captation={node.attrs.isCaptation}
            >
              <source src={node.attrs.src} />
            </video>
          )}
        </div>

        <div
          className={`vertical-resize-handle ${
            isVerticalResizeActive ? "vertical-resize-active" : ""
          }`}
          title={t("tiptap.media.resize")}
          onMouseDown={(e) => {
            e.stopPropagation();
            startVerticalResize(e);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            stopVerticalResize();
          }}
        />
      </div>
    </NodeViewWrapper>
  );
};

export default MediaRenderer;
