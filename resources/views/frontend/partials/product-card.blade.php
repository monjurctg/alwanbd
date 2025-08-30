<div class="product-card">
    <!-- Discount Badge -->
    @if($row->is_discount == 1 && $row->old_price != '')
        @php
            $discount = number_format((($row->old_price - $row->sale_price)*100)/$row->old_price);
        @endphp
        <span class="discount-badge">{{ $discount }}% {{ __('Off') }}</span>
    @endif

    <!-- Product Image -->
    <div class="product-image">
        <a href="{{ route('frontend.product', ['id' => $row->id, 'slug' => $row->slug ?? Str::slug($row->title)]) }}">
            <img src="{{ asset('storage/'.$row->f_thumbnail) }}"
                 alt="{{ $row->title }}"
                 class="product-img"
                 loading="lazy">
        </a>
    </div>

    <!-- Product Content -->
    <div class="product-content">
        <!-- Title -->
        <h3 class="product-title">
            <a href="{{ route('frontend.product', ['id' => $row->id, 'slug' => $row->slug ?? Str::slug($row->title)]) }}">
                {{ \Illuminate\Support\Str::limit($row->title, 50) }}
            </a>
        </h3>

        <!-- Rating -->
        <div class="product-rating">
            <div class="stars" style="--rating: {{ $row->ReviewPercentage / 20 }};"></div>
            <span class="rating-count">({{ $row->TotalReview }})</span>
        </div>

        <!-- Seller -->
        <div class="product-seller">
            {{ __('Sold By') }}
            <a href="{{ route('frontend.stores', ['id' => $row->seller_id, 'shop' => Str::slug($row->shop_url ?? $row->shop_name)]) }}" class="seller-link">
                {{ \Illuminate\Support\Str::limit($row->shop_name, 20) }}
            </a>
        </div>

        <!-- Price -->
        <div class="product-pricing">
            @if($row->sale_price != '')
                <div class="current-price">
                    {{ $gtext['currency_position'] == 'left' ? $gtext['currency_icon'] : '' }}
                    {{ NumberFormat($row->sale_price) }}
                    {{ $gtext['currency_position'] == 'right' ? $gtext['currency_icon'] : '' }}
                </div>

                @if($row->is_discount == 1 && $row->old_price != '')
                    <div class="original-price">
                        {{ $gtext['currency_position'] == 'left' ? $gtext['currency_icon'] : '' }}
                        {{ NumberFormat($row->old_price) }}
                        {{ $gtext['currency_position'] == 'right' ? $gtext['currency_icon'] : '' }}
                    </div>
                @endif
            @endif
        </div>

        <!-- Actions -->
        <div class="product-actions">
            <button class="add-to-cart-btn" data-id="{{ $row->id }}">
                <i class="bi bi-cart-plus"></i> {{ __('Add To Cart') }}
            </button>

            <div class="action-buttons">
                <button class="wishlist-btn" data-id="{{ $row->id }}" title="{{ __('Add to Wishlist') }}">
                    <i class="bi bi-heart"></i>
                </button>
                <a href="{{ route('frontend.product', ['id' => $row->id, 'slug' => $row->slug ?? Str::slug($row->title)]) }}" class="quick-view-btn" title="{{ __('View Details') }}">
                    <i class="bi bi-eye"></i>
                </a>
            </div>
        </div>
    </div>
</div>

<style>
/* Base Product Card Styles */
.product-card {
    position: relative;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transform: translateY(-3px);
}

/* Discount Badge */
.discount-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #e53935;
    color: white;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 600;
    z-index: 2;
}

/* Product Image */
.product-image {
    position: relative;
    padding: 15px;
    background: #f9f9f9;
    text-align: center;
}

.product-img {
    width: 100%;
    height: 160px;
    object-fit: contain;
    transition: transform 0.3s ease;
}

.product-card:hover .product-img {
    transform: scale(1.05);
}

/* Product Content */
.product-content {
    padding: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-title {
    margin: 0 0 8px;
}

.product-title a {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 42px;
    text-decoration: none;
}

.product-title a:hover {
    color: var(--theme-color);
}

/* Rating */
.product-rating {
    display: flex;
    align-items: center;
    margin: 5px 0;
}

.stars {
    --percent: calc(var(--rating) / 5 * 100%);
    display: inline-block;
    font-size: 14px;
    position: relative;
}

.stars::before {
    content: '★★★★★';
    background: linear-gradient(90deg, #ffb300 var(--percent), #ddd var(--percent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.rating-count {
    font-size: 12px;
    color: #666;
    margin-left: 5px;
}

/* Seller */
.product-seller {
    font-size: 12px;
    color: #666;
    margin: 5px 0;
}

.seller-link {
    color: var(--theme-color);
    font-weight: 500;
}

/* Pricing */
.product-pricing {
    margin: 8px 0 12px;
}

.current-price {
    font-size: 18px;
    font-weight: 700;
    color: var(--theme-color);
}

.original-price {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
}

/* Actions */
.product-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.add-to-cart-btn {
    flex: 1;
    padding: 8px 12px;
    background: var(--theme-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.add-to-cart-btn:hover {
    background: #333;
}

.action-buttons {
    display: flex;
    margin-left: 10px;
    gap: 5px;
}

.wishlist-btn, .quick-view-btn {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    background: #f5f5f5;
    border: none;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.wishlist-btn:hover, .quick-view-btn:hover {
    background: var(--theme-color);
    color: white;
}

/* Mobile Styles */
@media (max-width: 767px) {
    .product-img {
        height: 120px;
    }

    .product-title a {
        font-size: 14px;
        min-height: 38px;
    }

    .current-price {
        font-size: 16px;
    }

    .original-price {
        font-size: 13px;
    }

    .add-to-cart-btn {
        padding: 7px 10px;
        font-size: 13px;
    }

    .wishlist-btn, .quick-view-btn {
        width: 32px;
        height: 32px;
        font-size: 14px;
    }
}
</style>