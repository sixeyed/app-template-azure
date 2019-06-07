FROM mcr.microsoft.com/azure-cli

COPY init.sh /
ENTRYPOINT ["/bin/bash"]
CMD ["/init.sh"]

WORKDIR /assets
COPY assets .