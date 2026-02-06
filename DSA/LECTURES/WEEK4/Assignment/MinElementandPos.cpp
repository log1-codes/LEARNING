#include<bits/stdc++.h>
using namespace std;
void func(vector<long long>v)
{
    long long min = INT_MAX; 
    int pos = 0;
    int i =0;
    for(i; i<v.size() ; i++)
    {
        if(min>v[i])
        {
            min = v[i];
            pos=i;
        }
    }
   cout<<min<<" "<<pos+1;
} 
int main()
{
    int n ; 
    cin>>n;
    vector<long long>a(n); 
    for(int i =0 ;i<n ; i++)
    {
        cin>>a[i]; 
    }
    func(a);
    
}