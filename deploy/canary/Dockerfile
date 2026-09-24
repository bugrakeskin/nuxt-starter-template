# syntax=docker/dockerfile:1.7

FROM busybox:1.37.0-musl@sha256:5cec3fc171c87218698e85a52af7087de727372aae264a787b8112901a5b0092

ARG BUILD_REVISION
LABEL org.opencontainers.image.revision=$BUILD_REVISION

RUN test -n "$BUILD_REVISION" \
    && mkdir -p /www/api \
    && printf '{"status":"ok","service":"delivery-canary","revision":"%s"}\n' "$BUILD_REVISION" > /www/api/health

USER 65532:65532
EXPOSE 8080

HEALTHCHECK --interval=5s --timeout=2s --start-period=2s --retries=6 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/api/health"]

CMD ["httpd", "-f", "-p", "8080", "-h", "/www"]
