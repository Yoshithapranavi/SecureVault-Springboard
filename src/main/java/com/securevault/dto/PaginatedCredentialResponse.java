package com.securevault.dto;

import java.util.List;

public class PaginatedCredentialResponse {

    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;

    private List<CredentialResponse> content;

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public List<CredentialResponse> getContent() {
        return content;
    }

    public void setContent(List<CredentialResponse> content) {
        this.content = content;
    }
}