# 指定基础镜像，这是分阶段构建的前期阶段
FROM artifact.srdcloud.cn/public-docker-virtual/nginx:1.23.4


WORKDIR /var/www/

COPY  dist /var/www/front-web/dist

# 修改时区
ENV TZ="Asia/Shanghai"
RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo "${TZ}" > /etc/timezone
